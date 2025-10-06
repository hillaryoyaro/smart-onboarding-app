# 🌐 Smart Onboarding Frontend

A modern, responsive, and dynamic frontend built with **Next.js** for the **Smart Onboarding Platform**.  
It provides a seamless interface for form creation, onboarding workflows, and administrative dashboards — connected directly to the Django REST backend.

---

## 🚀 Overview

The frontend is designed to work closely with the Django backend to enable:
- Dynamic and customizable onboarding forms
- Real-time form submission and validation
- Integration with asynchronous notifications (via Celery/Redis on the backend)
- Admin and user-friendly UI/UX for managing onboarding data

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Next.js 14+ (App Router)](https://nextjs.org) |
| Language | TypeScript |
| UI Components | [ShadCN UI](https://ui.shadcn.com) & [Tailwind CSS](https://tailwindcss.com) |
| State Management | React Query / Zustand |
| API Communication | Axios / Fetch API |
| Authentication | Google Auth / NextAuth.js |
| Deployment | Vercel / Docker |
| Backend Connection | Django REST Framework API |

---

## ⚙️ Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **npm** or **yarn**
- Backend API running locally (see [`../backend/README.md`](../backend/README.md))
- (Optional) **Docker** if you prefer containerized setup

---

## 🛠️ Installation

Clone the repository and navigate to the `frontend` directory:

```bash
git clone https://github.com/yourusername/smart-onboarding-app.git
cd smart-onboarding-app/frontend

## 🛠️ Installation dependencies:
npm install
# or
yarn install

## 🔧 Environment Variables
Create a .env.local file in the root of the frontend folder and configure as below:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

## 💻 Running Locally
Start the development server:
npm run dev

## 🐳 Running with Docker (Production Mode)

Build and run the frontend container
docker build -t smart-onboarding-frontend .
docker run -d -p 3000:3000 --env-file .env.local smart-onboarding-frontend


## 🗂️ Folder Structure
frontend/
├── app/                   # Next.js App Router pages & layouts
├── components/            # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility and config files
├── public/                # Static assets
├── styles/                # Global and component-level styles
├── types/                 # TypeScript types
├── .env.local.example     # Example environment variables
├── package.json
└── next.config.js

## 🔗 Connecting Frontend to Backend

Ensure your backend (Django) is running at http://localhost:8000.

In frontend/.env.local, confirm:
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

You can verify connection by checking API calls in your browser’s network tab or console output in your terminal when running the frontend.

## 🌍 Deployment (Vercel or Docker)
➤ Deploy on Vercel

Push your frontend folder to GitHub.

Import your repo in Vercel
.

Add environment variables from .env.local.

Deploy — Vercel automatically builds and runs your Next.js app.

## ➤ Deploy with Docker Compose

You can combine both backend and frontend into one stack:
docker-compose up --build

Ensure your docker-compose.yml defines both services (backend & frontend) and connects them through a shared network.