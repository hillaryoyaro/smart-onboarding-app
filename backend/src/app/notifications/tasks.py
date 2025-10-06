from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from app.forms.models import Submission  # ✅ FIXED: correct import path

@shared_task
def notify_admin_of_submission(submission_id):
    try:
        submission = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return {"status": "not_found"}

    subject = f"New submission for {submission.form.name}"
    body = (
        f"Submission ID: {submission.id}\n"
        f"Form: {submission.form.name}\n"
        f"Data: {submission.data}\n"
        f"Files: {list(submission.files.values_list('file', flat=True))}"
    )

    admin_email = getattr(settings, "ADMIN_EMAIL", None)
    if admin_email:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [admin_email])
        return {"status": "notified"}
    else:
        print("ADMIN_EMAIL not set — notification printed instead:\n", body)
        return {"status": "printed"}
