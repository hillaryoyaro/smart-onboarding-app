import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

def upload_to_submission(instance, filename):
    slug = instance.submission.form.slug if instance.submission and instance.submission.form else "unknown"
    return f"uploads/{slug}/{instance.submission.id}/{filename}"

class Form(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    schema = models.JSONField(default=dict, blank=True)  # use this instead of `fields`
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="submissions")
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

class SubmissionFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="files")
    field_name = models.CharField(max_length=200)
    file = models.FileField(upload_to=upload_to_submission)
    uploaded_at = models.DateTimeField(auto_now_add=True)
