# AdityaTask — Secure Full-Stack Web Application

[![CI/CD](https://github.com/5h4d0wn1k/adityatask/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/5h4d0wn1k/adityatask/actions/workflows/ci-cd.yml)
[![last commit](https://img.shields.io/github/last-commit/5h4d0wn1k/adityatask)](https://github.com/5h4d0wn1k/adityatask)
[![issues](https://img.shields.io/github/issues/5h4d0wn1k/adityatask)](https://github.com/5h4d0wn1k/adityatask)

A security-hardened full-stack web application in TypeScript: React + Material
UI frontend, Express + MongoDB backend, and CI/CD that runs OWASP ZAP and Snyk
security scanning on every push.

## Why

Most starter apps ship with permissive defaults. This project demonstrates what
a production-grade authentication and security posture looks like when
architecture decisions are made defense-first: JWT access/refresh tokens,
CSRF protection, per-IP rate limiting, input validation, RBAC, and automated
security scanning in the pipeline. It is a reusable secure shell for building
task and account-management products on Node.js, TypeScript, and MongoDB —
useful both as a learning reference for secure full-stack development and as a
starting point for applications that must pass security review.

## Features

- **JWT authentication** (access + refresh tokens) with `register`, `login`,
  `refresh-token`, `logout`, and `validate` endpoints; passwords hashed with
  bcrypt.
- **Account hardening** — login-attempt tracking with lockout fields, password
  reset tokens, password-change invalidation, and a 2FA-ready user model.
- **Security middleware** — Helmet headers, CORS, CSRF token protection,
  `express-rate-limit`, 10kb request body limits, and output compression.
- **Input validation** — `express-validator` schemas for registration, login,
  profile, and password changes.
- **Role-based access control** — `restrictTo` middleware guards admin-only
  security endpoints (`/security/metrics`, `/security/scan`,
  `/security/vulnerabilities`).
- **React + Material UI frontend** — Formik + Yup forms, axios client,
  `jwt-decode`, and react-router navigation.
- **CI/CD with security scanning** — GitHub Actions runs an OWASP ZAP full
  scan and a Snyk dependency audit (`npm audit && snyk test`) on every push.
- **Deployment tooling** — `docker-compose` (frontend/backend/MongoDB),
  Kubernetes manifests (`k8s/`), and Terraform AWS provisioning.

## Quickstart

### Prerequisites

- Node.js 18+, Docker, and a running MongoDB instance (or `mongodb` service).

### Run locally

```bash
# Backend
cd backend
cp .env.example .env   # set MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:3000`.

### Run with Docker Compose

```bash
# root .env supplies MONGO_ROOT_USERNAME / MONGO_ROOT_PASSWORD
docker compose up
```

### Security scanning

```bash
npm run security-check   # npm audit + snyk test (backend)
bash security/zap-scan.sh   # OWASP ZAP automated scan
```

## Documentation

- [Security audit](./docs/security-audit.md)
- [Architecture diagram](./docs/architecture.puml)

## Project structure

```
frontend/       React + TypeScript + Material UI client
backend/        Express + TypeScript API (src/ with routes, controllers, middleware)
k8s/            Kubernetes deployment manifests
terraform/      AWS provisioning
security/       OWASP ZAP + JMeter load-test tooling
```

## Contributing

Contributions are welcome. Please follow the existing patterns, keep the test
suite green (`npm test`), and run the linter before opening a PR.

## License

Proprietary - see LICENSE

