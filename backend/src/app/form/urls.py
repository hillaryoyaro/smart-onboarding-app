from django.urls import path
from .views import FormListCreateView, FormSubmissionView

urlpatterns = [
    path("", FormListCreateView.as_view(), name="forms"),
    path("submit/", FormSubmissionView.as_view(), name="form-submit"),
]
