from django.db.models.signals import post_save
from django.dispatch import receiver
from app.forms.models import Submission
from app.notifications.tasks import notify_admin_of_submission

@receiver(post_save, sender=Submission)
def trigger_submission_notification(sender, instance, created, **kwargs):
    if created:
        notify_admin_of_submission.delay(instance.id)
