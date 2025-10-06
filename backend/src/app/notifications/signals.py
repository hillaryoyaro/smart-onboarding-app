# backend/forms/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Submission
from .tasks import notify_admin

@receiver(post_save, sender=Submission)
def trigger_notification(sender, instance, created, **kwargs):
    if created:
        notify_admin.delay(instance.form.created_by.email, instance.id)
