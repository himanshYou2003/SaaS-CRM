# 🚀 Multi-Tenant SaaS CRM

A production-ready, multi-tenant CRM built with **Laravel 11**, **MongoDB 7**, **Redis 8**, and a **React 18** SPA — fully containerized with Docker.

---

## ✨ Features

| Module            | Details                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| **Multi-Tenancy** | Logical isolation via `company_id` — single database, shared collections          |
| **RBAC**          | Granular role + permission system, Redis-cached per user                          |
| **Leads**         | Full CRUD, status pipeline, assignment, tagging                                   |
| **Contacts**      | Contact book with company/position                                                |
| **Deals**         | Kanban pipeline with 6 stages, `DealWon` event, revenue tracking                  |
| **Analytics**     | MongoDB aggregations for revenue, conversion rate, sales performance              |
| **API Tokens**    | Sanctum personal access tokens                                                    |
| **Subscriptions** | Plan management + automatic expiry via scheduled commands                         |
| **Webhooks**      | HMAC-verified inbound webhooks                                                    |
| **Queue/Jobs**    | Redis queues with Laravel Horizon (`notifications`, `analytics`, `subscriptions`) |
| **React SPA**     | Dark-mode UI with charts, Kanban board, and modals                                |

---

## 🏗 Architecture

```
multi/
├── backend/            # Laravel 11 application
│   ├── app/
│   │   ├── Console/Commands/
│   │   ├── DTO/
│   │   ├── Events/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/
│   │   │   └── Middleware/
│   │   ├── Listeners/
│   │   ├── Models/
│   │   ├── Policies/
│   │   ├── Providers/
│   │   ├── Repositories/
│   │   └── Services/
│   ├── config/
│   ├── routes/
│   └── tests/Feature/
├── frontend/           # React 18 + Vite SPA
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
├── docker/
│   ├── nginx/
│   ├── php/
│   └── mongo/
├── .github/workflows/  # GitHub Actions CI
├── docker-compose.yml
└── Makefile
```

---

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Compose)

### 1. Clone & Start

```bash
git clone <repo-url> && cd multi
make build       # Build all Docker images
make up          # Start all services
make setup       # Install PHP deps, generate key
```

### 2. Access

| Service           | URL                                         |
| ----------------- | ------------------------------------------- |
| Laravel API       | http://localhost:8080/api/v1                |
| Swagger Docs      | http://localhost:8080/api/documentation     |
| Horizon Dashboard | http://localhost:8080/horizon               |
| React Frontend    | http://localhost:5173 (run `make frontend`) |

### 3. Register & Login

```bash
# Register your company
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"company_name":"Acme","name":"Admin","email":"admin@acme.com","password":"secret123!","password_confirmation":"secret123!"}'
```

---

## 🔧 Common Commands

```bash
make up                        # Start containers
make down                      # Stop containers
make shell                     # PHP container shell
make artisan CMD="horizon"     # Run Horizon
make artisan CMD="queue:work"  # Process queues
make test                      # Run backend tests
make frontend                  # Start Vite dev server
```

---

## 🔐 API Authentication

All CRM endpoints require `Authorization: Bearer <token>` (Sanctum).  
Tokens can be created via `POST /api/v1/tokens` (requires logged-in session).

---

## 🗄 Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Backend        | PHP 8.4, Laravel 11, MongoDB Laravel Driver |
| Database       | MongoDB 7                                   |
| Cache / Queues | Redis 8, Laravel Horizon                    |
| Auth           | Laravel Sanctum                             |
| API Docs       | L5-Swagger (OpenAPI 3.0)                    |
| Frontend       | React 18, Vite 5, React Router v6, Recharts |
| CI/CD          | GitHub Actions                              |
| Container      | Docker Compose                              |

---

## 🧪 Testing

```bash
make test
# or inside the container:
php artisan test --parallel
```

Tests are in `backend/tests/Feature/` (`AuthTest`, `LeadTest`).

---

## 📋 Environment Variables

Copy `backend/.env` and adjust:

```env
DB_HOST=mongo            # MongoDB container
DB_DATABASE=crm_db
DB_USERNAME=crm_user
DB_PASSWORD=crm_secret

REDIS_HOST=redis         # Redis container
REDIS_PASSWORD=crm_redis_secret

SANCTUM_STATEFUL_DOMAINS=localhost:5173
```
