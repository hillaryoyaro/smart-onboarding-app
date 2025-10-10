# src/app/form/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Form, Submission, SubmissionFile
from .serializers import FormSerializer, SubmissionSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction
import json

class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all().order_by("-created_at")
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"

    @action(detail=True, methods=["POST"], url_path="submit")
    def submit(self, request, slug=None):
        form = get_object_or_404(Form, slug=slug)

        # JSON request
        if request.content_type and "application/json" in request.content_type:
            data = request.data.get("data") or request.data
            if isinstance(data, str):
                data = json.loads(data)
            submission = Submission.objects.create(form=form, data=data)
            serializer = SubmissionSerializer(submission)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Multipart (form-data)
        payload_raw = request.POST.get("payload") or request.POST.get("data")
        try:
            payload = json.loads(payload_raw) if payload_raw else {}
        except Exception:
            payload = {}

        with transaction.atomic():
            submission = Submission.objects.create(form=form, data=payload)
            for key in request.FILES:
                uploaded = request.FILES.getlist(key)
                for f in uploaded:
                    SubmissionFile.objects.create(submission=submission, field_name=key, file=f)
            serializer = SubmissionSerializer(submission)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
