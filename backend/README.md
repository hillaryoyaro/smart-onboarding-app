# 🛠️ Smart Onboarding Backend

The **Smart Onboarding Backend** is a Django REST API designed to power the Smart Onboarding platform.  
It enables the creation, management, and submission of customizable onboarding forms, supporting asynchronous notifications via **Celery** and **Redis**.

---

## 🚀 Overview

This backend forms the core of the Smart Onboarding system.  
It exposes RESTful endpoints consumed by the Next.js frontend for:

- Dynamic and customizable onboarding forms  
- Secure data storage and submission tracking  
- Admin notifications and task handling with Celery  
- Authentication and user management  
- Scalable API ready for cloud deployment (Docker, Railway, or Render)

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Django 5+](https://www.djangoproject.com/) |
| API Layer | [Django REST Framework (DRF)](https://www.django-rest-framework.org/) |
| Task Queue | [Celery](https://docs.celeryq.dev/) |
| Message Broker | [Redis](https://redis.io/) |
| Database | SQLite (local) / PostgreSQL (production) |
| Testing | pytest / unittest |
| Containerization | Docker / Docker Compose |
| Deployment | Railway / Render / GCP / AWS |
| Authentication | Django users + (optionally JWT/Google OAuth via frontend) |

---

## 2️⃣ Create Virtual Environment
python -m venv .venv
source .venv/bin/activate   # On macOS/Linux
# or
.venv\Scripts\activate      # On Windows

## 3️⃣ Install Dependencies
pip install -r requirements.txt


## ⚙️ Environment Variables
Create a .env file in src/config/ and configure your environment:
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=*

# Database (use PostgreSQL in production)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# Redis and Celery
REDIS_URL=redis://localhost:6379/0

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

## 💻 Running Locally
1️⃣ Start Redis

Make sure Redis is running locally.
You can start it via Docker or system service:
docker run -d -p 6379:6379 redis

2️⃣ Run Django Server
cd src
python manage.py migrate
python manage.py runserver
Server runs at 👉 http://localhost:8000

3️⃣ Run Celery Worker
In another terminal (still inside your virtual environment):
cd src
celery -A config worker -l info

You should see:
[tasks]
  . app.forms.tasks.notify_admin_of_submission
  . app.notifications.tasks.notify_admin_of_submission
  . config.celery.debug_task

## 🧪 Running Tests
pytest
# or
python manage.py test

# Tests are located in src/tests/:

test_forms.py

test_notifications.py

test_users.py

## 🐳 Running in Docker (Production Mode)
# 1️⃣ Build Docker Image
docker build -t smart-onboarding-backend .

# 2️⃣ Run Docker Container
docker run -d -p 8000:8000 --env-file .env smart-onboarding-backend

## 🐝 Running Celery in Docker

You can define a docker-compose.yml like this:
version: '3.9'

services:
  backend:
    build: .
    command: python src/manage.py runserver 0.0.0.0:8000
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  celery:
    build: .
    command: celery -A config worker -l info
    depends_on:
      - backend
      - redis

# Then run:
docker-compose up --build

## 🔗 Connecting Backend with Frontend

# Your frontend (Next.js) should point to the backend API:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Ensure CORS is properly configured in settings.py:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

Then, start the frontend (npm run dev in the frontend folder).

## ☁️ Deployment Guide

You can deploy this backend easily on:

Railway.app

Render

AWS / GCP / Azure

Docker + Nginx Reverse Proxy

Example (Railway)

Connect your GitHub repo.

Add environment variables from .env.

Railway automatically builds and runs Django + Celery.

## 🧠 Developer Tips

Always start Redis before Celery.

Use celery -A config flower to monitor tasks via Flower dashboard.

For production, use PostgreSQL instead of SQLite.

Use Gunicorn + Nginx for deployment.

## 📁 Useful Commands
| Action               | Command                                            |
| -------------------- | -------------------------------------------------- |
| Start server         | `python manage.py runserver`                       |
| Run Celery worker    | `celery -A config worker -l info`                  |
| Create migrations    | `python manage.py makemigrations`                  |
| Apply migrations     | `python manage.py migrate`                         |
| Run tests            | `pytest`                                           |
| Build Docker image   | `docker build -t smart-onboarding-backend .`       |
| Run Docker container | `docker run -p 8000:8000 smart-onboarding-backend` |


## 💡 Summary
| Environment | Command                                      | Description                            |
| ----------- | -------------------------------------------- | -------------------------------------- |
| Local       | `python manage.py runserver`                 | Run Django app                         |
| Celery      | `celery -A config worker -l info`            | Start task worker                      |
| Redis       | `docker run -d -p 6379:6379 redis`           | Start Redis container                  |
| Docker      | `docker build -t smart-onboarding-backend .` | Build image                            |
| Compose     | `docker-compose up --build`                  | Start stack (backend + redis + celery) |

