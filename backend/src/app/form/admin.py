from django.contrib import admin
from .models import Form, Submission, SubmissionFile

@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name", "slug")

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "form", "created_at")
    readonly_fields = ("data",)

@admin.register(SubmissionFile)
class SubmissionFileAdmin(admin.ModelAdmin):
    list_display = ("submission", "field_name", "file", "uploaded_at")
