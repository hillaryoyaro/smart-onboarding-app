from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Form, Submission, SubmissionFile
from .serializers import FormSerializer, SubmissionSerializer
from django.shortcuts import get_object_or_404
from app.notifications.tasks import notify_admin_on_submission

class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    lookup_field = "slug"

    @action(detail=True, methods=["post"], url_path="submit")
    def submit(self, request, slug=None):
        form = self.get_object()
        # Accept either JSON body or multipart form-data with "payload"
        # If client sends 'payload' as JSON string
        payload = request.data.get("payload")
        if payload:
            try:
                import json
                data = json.loads(payload)
            except Exception:
                data = {}
        else:
            # take non-file fields
            data = {k: v for k, v in request.data.items() if k not in request.FILES}
        # create submission
        submission = Submission.objects.create(form=form, data=data)
        # handle files in request.FILES (can be multiple per field)
        for field_name, file_list in request.FILES.lists():
            for f in file_list:
                SubmissionFile.objects.create(submission=submission, field_name=field_name, file=f)
        # Trigger async notification
        notify_admin_on_submission.delay(str(submission.id))
        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)
