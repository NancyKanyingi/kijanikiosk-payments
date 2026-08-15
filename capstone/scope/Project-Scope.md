{`# KijaniKiosk Capstone Project Scope

Student: Nancy Wangui Kanyingi

Project: KijaniKiosk End-to-End Delivery

Track: Track B — Serverless-First

## Problem Statement

KijaniKiosk currently provides a production-approaching payment service running on Kubernetes with a CI/CD pipeline and a three-function serverless receipt workflow. The capstone extends this platform into a complete event-driven DevOps system by adding analytics, deployment governance, and end-to-end integration between Kubernetes and the serverless architecture.

The objective is to demonstrate how a payment travels from a containerized application through an event-driven serverless pipeline while maintaining reproducibility, observability, and controlled software delivery.

## Success Criteria

The project will be considered successful when:

- The Kubernetes kk-payments service successfully writes receipt events to the staging S3 bucket.
- The complete four-function serverless workflow executes automatically.
- The new kk-analytics function produces structured aggregation summaries.
- Jenkins successfully performs the staging deployment through the existing pipeline.
- A manual approval gate is demonstrated before production deployment.
- Documentation allows another engineer to reproduce the project using the repository.

## In Scope

- Kubernetes kk-payments deployment
- Jenkins CI/CD pipeline (manual trigger)
- Docker image publishing
- Serverless receipt processing
- kk-notifier event workflow
- New kk-analytics aggregation function
- AI-assisted operational log analysis
- Governance and deployment documentation

## Out of Scope

- GitHub webhook automation
- Multi-cloud deployment
- Kubernetes autoscaling (HPA)
- Production TLS certificates
- External monitoring platforms (Prometheus/Grafana)

## Architecture

The KijaniKiosk platform follows an event-driven DevOps architecture composed of four layers:

1. Delivery Layer — GitHub stores the source code and Jenkins is manually triggered through the Jenkins UI to execute the CI/CD pipeline.
2. Runtime Layer — Kubernetes hosts the kk-payments application behind an NGINX Ingress using ConfigMaps, Secrets, and three application replicas.
3. Event Layer — Successful payments generate receipt events in Amazon S3, triggering the Receipt Processor, Notifier, and Analytics serverless functions.
4. Intelligence Layer — Structured logs produced by the Analytics function support monitoring and AI-assisted operational incident analysis.

See `capstone/architecture/architecture-diagram.png` for the complete system architecture.
