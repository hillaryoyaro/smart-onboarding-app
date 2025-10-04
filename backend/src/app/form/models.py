from django.db import models
import uuid
from django.contrib.postgres.fields import JSONField

class Form(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    schema = models.JSONField(default=dict)   # {"fields":[{key,label,type,required,options,multiple}], "rules": [...]}
    created_at = models.DateTimeField(auto_now_add=True)
    schema_version = models.IntegerField(default=1)

    def __str__(self):
        return self.name

class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    form = models.ForeignKey(Form, related_name="submissions", on_delete=models.CASCADE)
    data = models.JSONField()   # answers
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)

class FileUpload(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(Submission, related_name="files", on_delete=models.CASCADE)
    field_key = models.CharField(max_length=128)
    file = models.FileField(upload_to="uploads/%Y/%m/%d/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
