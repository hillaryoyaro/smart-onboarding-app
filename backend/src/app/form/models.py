from django.db import models
import uuid

def upload_to_submission(instance, filename):
    return f"uploads/{instance.submission.form.slug}/{instance.submission.id}/{filename}"

class Form(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    schema = models.JSONField(default=dict)  # JSON describing fields & validation rules
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="submissions")
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class SubmissionFile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="files")
    field_name = models.CharField(max_length=200)
    file = models.FileField(upload_to=upload_to_submission)
    uploaded_at = models.DateTimeField(auto_now_add=True)
