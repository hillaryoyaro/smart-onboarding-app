from django.test import TestCase
from app.form.models import Form

class FormModelTest(TestCase):
    def test_create_form(self):
        f = Form.objects.create(name="Test Form", slug="test-form", schema={"fields": []})
        self.assertEqual(f.slug, "test-form")
