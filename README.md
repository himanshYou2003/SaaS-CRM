# DocMonitoring CRM by himanshu

A high-performance, multi-tenant CRM built for the modern enterprise. This project is a proprietary implementation focusing on scalability, security, and a premium user experience.

---

## 🛠 Core Stack

- **Backend**: Laravel 11 (PHP 8.4)
- **Database**: MongoDB 7 (High-performance aggregations)
- **Caching/Queues**: Redis 8 & Laravel Horizon
- **Frontend**: React 18 + Vite (SaaS 2.0 Aesthetic)
- **Architecture**: Fully Dockerized

## ✨ Key Features

- **Multi-Tenant Architecture**: Complete data isolation between companies.
- **Enterprise RBAC**: Fine-grained role and permission management.
- **Lead & Deal Management**: Specialized pipelines for high-velocity sales.
- **Analytics Engine**: Real-time revenue dynamics and growth projections.
- **API First**: Dedicated Sanctum tokens for third-party integrations.

---

## 🚀 Getting Started

**Prerequisites**: Docker & Makefile

```bash
# Clone and enter directory
git clone <repo-url> && cd multi

# Orchestration
make build   # Build Docker images
make up      # Run services
make setup   # Initialize application
```

### 📍 Local Services

- **Dashboard**: [http://localhost:5173](http://localhost:5173)
- **API Specs**: [http://localhost:8080/api/documentation](http://localhost:8080/api/documentation)
- **Queues**: [http://localhost:8080/horizon](http://localhost:8080/horizon)

---

## � Environment

Configure your `.env` in the `backend/` directory.

```bash
# MongoDB
DB_HOST=mongo
DB_DATABASE=crm_db
DB_USERNAME=himanshu_admin

# Redis
REDIS_HOST=redis
```

---

_Hand-crafted with precision by **himanshu**._
