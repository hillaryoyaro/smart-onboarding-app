from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Form
import json

class FormsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.form = Form.objects.create(name="LoanApp", slug="loanapp", schema={"fields":[{"key":"full_name","label":"Full name","type":"text","required":True}]})

    def test_get_forms_list(self):
        res = self.client.get('/api/forms/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.json().get('results', res.json())) >= 1)

    def test_submit_minimal(self):
        url = f'/api/forms/{self.form.slug}/submit/'
        # simple form submission without files
        res = self.client.post(url, {'full_name':'Alice'})
        self.assertEqual(res.status_code, 201)
        body = res.json()
        self.assertIn('id', body)
        self.assertEqual(body['data']['full_name'], 'Alice')
