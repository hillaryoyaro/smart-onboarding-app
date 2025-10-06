# src/app/form/serializers.py
from rest_framework import serializers
from .models import Form, Submission, SubmissionFile

class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ["id", "name", "slug", "description", "schema", "created_by", "created_at"]
        read_only_fields = ["id", "created_by", "created_at"]

class SubmissionFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionFile
        fields = ["id", "field_name", "file", "uploaded_at"]

class SubmissionSerializer(serializers.ModelSerializer):
    files = SubmissionFileSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = ["id", "form", "data", "files", "created_at"]
        read_only_fields = ["id", "created_at", "files"]

    def create(self, validated_data):
        # normal DRF create not used for file upload endpoint; included for completeness
        return super().create(validated_data)
