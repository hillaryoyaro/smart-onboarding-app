from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Submission

@shared_task(bind=True)
def notify_admin_of_submission(self, submission_id):
    try:
        s = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return {"status":"not_found"}

    subject = f"New submission for {s.form.name}"
    body = f"Submission ID: {s.id}\nForm: {s.form.name}\nCreated at: {s.created_at}\nData: {s.data}\nMetadata: {s.metadata}"
    # Default to console email backend in dev; configure SMTP in production via settings.
    admin_email = getattr(settings, "ADMIN_EMAIL", None)
    if admin_email:
        send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [admin_email])
        s.processed = True
        s.save()
        return {"status":"notified"}
    else:
        # If admin email not configured, log to stdout (developer convenience)
        print("ADMIN_EMAIL not set. Notification payload:\n", body)
        s.processed = True
        s.save()
        return {"status":"printed"}
