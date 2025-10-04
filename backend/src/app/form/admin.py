from django.contrib import admin
from .models import Form, Submission, FileUpload

@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ("name","slug","created_at")
    readonly_fields = ("created_at","schema_version")

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id","form","created_at","processed")
    readonly_fields = ("created_at","data","metadata")

@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display = ("id","submission","field_key","file","uploaded_at")
    readonly_fields = ("uploaded_at",)
