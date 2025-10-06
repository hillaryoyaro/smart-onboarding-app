# src/app/form/models.py
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

def upload_to_submission(instance, filename):
    # store files under media/uploads/<form-slug>/<submission-id>/filename
    slug = instance.submission.form.slug if instance.submission and instance.submission.form else "unknown"
    return f"uploads/{slug}/{instance.submission.id}/{filename}"

class Form(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    # schema: list of fields and validation rules. Example shape below.
    schema = models.JSONField(default=dict)  # { "fields": [ {label,type, name, required, options, ...}, ... ] }
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="submissions")
    data = models.JSONField()  # key: field_name => value(s)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Submission {self.id} for {self.form.slug}"

class SubmissionFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="files")
    field_name = models.CharField(max_length=200)
    file = models.FileField(upload_to=upload_to_submission)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File {self.file.name} ({self.field_name})"
