from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # ✅ added
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.db import transaction
import json

from .models import Form, Submission, SubmissionFile
from .serializers import FormSerializer, SubmissionSerializer


class FormViewSet(viewsets.ModelViewSet):
    """
    Handles:
    - GET /api/forms/ → list all forms
    - GET /api/forms/<slug>/ → get specific form
    - POST /api/forms/<slug>/submit/ → submit form data (with optional file uploads)
    """
    queryset = Form.objects.all().order_by("-created_at")
    serializer_class = FormSerializer
    permission_classes = [AllowAny]  # ✅ public access for all endpoints
    lookup_field = "slug"

    # GET /api/forms/<slug>/
    def retrieve(self, request, slug=None):
        """Return a specific form schema by slug."""
        form = get_object_or_404(Form, slug=slug)
        serializer = self.get_serializer(form)
        return Response(serializer.data)

    # POST /api/forms/<slug>/submit/
    @action(detail=True, methods=["POST"], url_path="submit")
    def submit(self, request, slug=None):
        """Handle form submissions — JSON or multipart (file upload)."""
        form = get_object_or_404(Form, slug=slug)

        # 🧾 Case 1: JSON (application/json)
        if request.content_type and "application/json" in request.content_type:
            data = request.data.get("data") or request.data
            if isinstance(data, str):
                data = json.loads(data)
            submission = Submission.objects.create(form=form, data=data)
            serializer = SubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # 📂 Case 2: Multipart (FormData with files)
        payload_raw = request.POST.get("payload") or request.POST.get("data")
        try:
            payload = json.loads(payload_raw) if payload_raw else {}
        except Exception:
            payload = {}

        with transaction.atomic():
            submission = Submission.objects.create(form=form, data=payload)

            # ✅ Handle uploaded files
            for key in request.FILES:
                uploaded_files = request.FILES.getlist(key)
                for f in uploaded_files:
                    SubmissionFile.objects.create(
                        submission=submission,
                        field_name=key,
                        file=f
                    )

            serializer = SubmissionSerializer(submission)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 🆕 Optional: Dedicated upload endpoint
    @action(detail=False, methods=["POST"], url_path="upload-file")
    def upload_file(self, request):
        """
        POST /api/forms/upload-file/
        Upload a standalone file (without form submission).
        """
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Optionally save it somewhere
        submission_file = SubmissionFile.objects.create(
            submission=None,
            field_name="standalone_upload",
            file=uploaded_file
        )

        return Response(
            {
                "message": "File uploaded successfully!",
                "file_name": uploaded_file.name,
                "file_url": submission_file.file.url
            },
            status=status.HTTP_201_CREATED
        )
