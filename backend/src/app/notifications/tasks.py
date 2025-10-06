# backend/forms/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def notify_admin(admin_email, submission_id):
    send_mail(
        subject="New Form Submission",
        message=f"A new submission (ID: {submission_id}) has been received.",
        from_email="noreply@onboardingapp.com",
        recipient_list=[admin_email],
    )
