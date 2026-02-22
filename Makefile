# ── SaaS CRM Makefile ──────────────────────────────────────────────────────────
# Convenience commands for common operations

.PHONY: up down build shell artisan composer logs test frontend horizon

## Start all Docker containers
up:
	docker compose up -d

## Stop all containers
down:
	docker compose down

## Build Docker images
build:
	docker compose build --no-cache

## Open a shell in the Laravel app container
shell:
	docker compose exec app bash

## Run an Artisan command  (usage: make artisan CMD="migrate")
artisan:
	docker compose exec app php artisan $(CMD)

## Run Composer (usage: make composer CMD="require some/package")
composer:
	docker compose exec app composer $(CMD)

## View logs
logs:
	docker compose logs -f app

## Run Laravel tests
test:
	docker compose exec app php artisan test

## Install backend deps and set up Laravel (first time)
setup:
	docker compose up -d
	docker compose exec app composer install
	docker compose exec app php artisan key:generate
	@echo "✅ Backend ready at http://localhost:8080"

## Install frontend deps
frontend-install:
	cd frontend && npm install

## Start frontend dev server
frontend:
	cd frontend && npm run dev

## Open Horizon dashboard
horizon:
	open http://localhost:8080/horizon

## Watch Horizon queue in terminal
horizon-shell:
	docker compose exec horizon php artisan horizon:status
