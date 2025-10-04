from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Form, Submission, FileUpload
from .serializers import FormSerializer, SubmissionSerializer
from .tasks import notify_admin_of_submission

class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all().order_by('-created_at')
    serializer_class = FormSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def submit(self, request, slug=None):
        """
        Accepts multipart/form-data where text fields are posted and files are included.
        Saves Submission and FileUpload rows and triggers async notification.
        """
        form = get_object_or_404(Form, slug=slug)

        # Build data dict from POST fields
        data = {}
        # if frontend sends fields as JSON in a 'payload' field, accept that too:
        if 'payload' in request.POST:
            # expecting JSON string
            import json
            try:
                data = json.loads(request.POST.get('payload'))
            except Exception:
                data = {}
        else:
            for k, v in request.POST.items():
                data[k] = v

        # Minimal server-side rule evaluation - optional; implement specific rules in form.schema['rules']
        # For now we only accept submission and save metadata
        metadata = {'ip': request.META.get('REMOTE_ADDR'), 'user_agent': request.META.get('HTTP_USER_AGENT',''), 'schema_version': form.schema_version}

        with transaction.atomic():
            submission = Submission.objects.create(form=form, data=data, metadata=metadata)

            # Save files: support multiple file inputs and multiple files per input (if multiple attr used)
            for fkey in request.FILES:
                file_list = request.FILES.getlist(fkey)
                for f in file_list:
                    FileUpload.objects.create(submission=submission, field_key=fkey, file=f)

        # trigger async notify
        notify_admin_of_submission.delay(str(submission.id))

        return Response(SubmissionSerializer(submission).data, status=status.HTTP_201_CREATED)

class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin can list submissions for a form via /api/forms/{slug}/submissions/
    We'll provide a custom route on FormViewSet to fetch submissions per form instead.
    """
    serializer_class = SubmissionSerializer
    queryset = Submission.objects.all().order_by('-created_at')
