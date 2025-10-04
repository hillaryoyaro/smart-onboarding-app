from rest_framework import serializers
from .models import Form, Submission, FileUpload

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = "__all__"

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ["id","field_key","file","uploaded_at"]

class SubmissionSerializer(serializers.ModelSerializer):
    files = FileUploadSerializer(many=True, read_only=True)
    class Meta:
        model = Submission
        fields = ["id","form","data","metadata","created_at","processed","files"]
