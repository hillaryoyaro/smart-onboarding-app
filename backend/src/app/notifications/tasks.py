from celery import shared_task

@shared_task
def notify_admin(form_id, submission_id):
    # send email / Slack message to admin
    print(f"Admin notified: new submission {submission_id} for form {form_id}")
