from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
import json

from .models import Form, Submission, SubmissionFile
from .serializers import FormSerializer, SubmissionSerializer
from app.notifications.tasks import notify_admin_of_submission  # ensure this path is correct


class FormViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - GET /api/forms/ → list all forms
    - GET /api/forms/<slug>/ → get specific form
    - POST /api/forms/<slug>/submit/ → submit form data (with optional file uploads)
    """
    queryset = Form.objects.all().order_by("-created_at")
    serializer_class = FormSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    # 🧱 Default KYC Schema
    def get_default_kyc_schema(self):
        return {
            "title": "Know Your Customer (KYC) Form",
            "description": "Please complete your KYC information to verify your identity and comply with financial regulations.",
            "fields": [
                {"name": "full_name", "label": "Full Name", "type": "text", "required": True},
                {"name": "email", "label": "Email Address", "type": "email", "required": True},
                {"name": "phone_number", "label": "Phone Number", "type": "text", "required": True},
                {"name": "date_of_birth", "label": "Date of Birth", "type": "date", "required": True},
                {"name": "gender", "label": "Gender", "type": "select", "options": ["Male", "Female", "Other"], "required": True},
                {"name": "national_id_number", "label": "National ID / Passport Number", "type": "text", "required": True},
                {"name": "id_document", "label": "Upload ID Document", "type": "file", "required": True},
                {"name": "address", "label": "Residential Address", "type": "textarea", "required": True},
                {"name": "city", "label": "City / Town", "type": "text", "required": True},
                {"name": "country", "label": "Country", "type": "select", "options": ["Kenya", "Uganda", "Tanzania", "Rwanda", "South Sudan", "Ethiopia", "Other"], "required": True},
                {"name": "occupation", "label": "Occupation", "type": "text"},
                {"name": "signature", "label": "Upload Signature", "type": "file"},
            ],
        }
        # 🧱 Default Loan Schema
    def get_default_loan_schema(self):
        return {
            "title": "Loan Application Form",
            "description": "Please fill out this form to apply for a loan.",
            "fields": [
                {"name": "full_name", "label": "Full Name", "type": "text", "required": True},
                {"name": "email", "label": "Email Address", "type": "email", "required": True},
                {"name": "phone_number", "label": "Phone Number", "type": "text", "required": True},
                {"name": "national_id_number", "label": "National ID Number", "type": "text", "required": True},
                {"name": "amount_requested", "label": "Amount Requested", "type": "number", "required": True},
                {"name": "loan_purpose", "label": "Purpose of Loan", "type": "textarea", "required": True},
                {"name": "repayment_period", "label": "Repayment Period", "type": "select", "options": ["3 Months", "6 Months", "12 Months", "24 Months"], "required": True},
                {"name": "employment_status", "label": "Employment Status", "type": "select", "options": ["Employed", "Self-Employed", "Unemployed"], "required": True},
                {"name": "monthly_income", "label": "Monthly Income", "type": "number", "required": True},
                {"name": "collateral_document", "label": "Collateral Document (Optional)", "type": "file"},
            ],
        }

        

    # 🧾 GET /api/forms/<slug>/
    def retrieve(self, request, slug=None):
        """Return a specific form schema by slug (auto-create if KYC form missing)."""
        form = Form.objects.filter(slug=slug).first()

        if not form and slug == "kycform":
            form = Form.objects.create(
                name="KYC Verification Form",
                slug="kycform",
                schema=self.get_default_kyc_schema(),
            )
            print("✅ Auto-created default KYC form in database")

        # ✅ Auto-create default Loan form
        if not form and slug == "loanform":
            form = Form.objects.create(
                name="Loan Application Form",
                slug="loanform",
                schema=self.get_default_loan_schema(),
            )
            print("✅ Auto-created default Loan form in database")    

        if not form:
            return Response({"error": "Form not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(form)
        return Response(serializer.data)

    # 📝 POST /api/forms/<slug>/submit/
    @action(detail=True, methods=["POST"], url_path="submit")
    def submit(self, request, slug=None):
        """Handle form submissions — JSON or multipart (file upload)."""
        form = get_object_or_404(Form, slug=slug)

        # Case 1: JSON
        if request.content_type and "application/json" in request.content_type:
            data = request.data.get("data") or request.data
            if isinstance(data, str):
                data = json.loads(data)

            submission = Submission.objects.create(form=form, data=data)
            notify_admin_of_submission.delay(submission.id)  # async Celery task

            serializer = SubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Case 2: Multipart (FormData + files)
        payload_raw = request.POST.get("payload") or request.POST.get("data")
        try:
            payload = json.loads(payload_raw) if payload_raw else {}
        except Exception:
            payload = {}

        with transaction.atomic():
            submission = Submission.objects.create(form=form, data=payload)
            for key in request.FILES:
                uploaded_files = request.FILES.getlist(key)
                for f in uploaded_files:
                    SubmissionFile.objects.create(
                        submission=submission, field_name=key, file=f
                    )

            notify_admin_of_submission.delay(submission.id)  # async Celery task
            serializer = SubmissionSerializer(submission)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 🆕 POST /api/forms/upload-file/
    @action(detail=False, methods=["POST"], url_path="upload-file")
    def upload_file(self, request):
        """Upload a standalone file without submission."""
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        submission_file = SubmissionFile.objects.create(
            submission=None, field_name="standalone_upload", file=uploaded_file
        )

        return Response(
            {
                "message": "File uploaded successfully!",
                "file_name": uploaded_file.name,
                "file_url": submission_file.file.url,
            },
            status=status.HTTP_201_CREATED,
        )
