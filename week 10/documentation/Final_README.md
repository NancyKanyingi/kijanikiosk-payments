
# KijaniKiosk Payments Platform

## Production-Approaching DevOps Capstone

### Overview

KijaniKiosk Payments Platform is a production-approaching DevOps project that demonstrates the complete software delivery lifecycle using Infrastructure as Code, Kubernetes, Serverless computing, and CI/CD automation.

The platform processes payment requests, generates receipts asynchronously, produces analytics summaries, and deploys application updates through a controlled Jenkins pipeline with manual production approval.

---

## System Architecture

The solution is composed of three primary layers:

1. **Kubernetes Application Layer**

   * `kk-api` REST service
   * `kk-payments` payment processing service
   * NGINX Ingress Controller
   * ConfigMaps and Secrets
   * Health probes and rolling updates

2. **Serverless Processing Layer**

   * Receipt generation
   * Receipt processing
   * Notification dispatch
   * Analytics summary generation

3. **CI/CD Layer**

   * GitHub source control
   * Jenkins Pipeline
   * Nexus package repository
   * Manual production approval
   * Kubernetes rolling deployment

---

## Technologies Used

| Category           | Technology               |
| ------------------ | ------------------------ |
| Language           | Node.js                  |
| Containers         | Docker                   |
| Orchestration      | Kubernetes (Minikube)    |
| Ingress            | NGINX Ingress Controller |
| CI/CD              | Jenkins                  |
| Package Repository | Sonatype Nexus           |
| Serverless         | Serverless Framework     |
| Version Control    | Git & GitHub             |

---

## Deployment Workflow

1. Developer pushes changes to GitHub.
2. Jenkins checks out the latest revision.
3. Linting, testing, and security audit execute.
4. Application package is published to Nexus.
5. Manual approval is required before production.
6. Kubernetes performs a rolling deployment.
7. Rollout status confirms successful deployment.

---

## Serverless Receipt Workflow

The receipt workflow operates asynchronously:

* Payment received
* Receipt generated
* Receipt processed
* Notification dispatched
* Analytics summary updated

This architecture separates payment processing from background receipt operations, improving scalability and fault isolation.

---

## Operational Validation

The completed platform demonstrates:

* Kubernetes rolling updates
* Readiness and liveness probes
* Ingress-based routing
* Manual production approval
* Successful CI/CD deployment
* Serverless event-driven processing
* Deployment rollback capability

---

## Project Outcome

The capstone demonstrates an integrated DevOps delivery platform combining container orchestration, event-driven computing, infrastructure automation, and governed continuous deployment within a single production-oriented workflow.
