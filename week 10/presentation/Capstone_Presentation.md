## Presentation Narration

**Audio Presentation (5 minutes)**

[ Listen to the Capstone Presentation](/home/nancy/Downloads/package/dist/cf83ed69-0409-4896-90e9-652fa8e87755.webm


# KijaniKiosk Payments Platform

## Capstone Presentation

**Student:** Nancy Wangui Kanyingi

---

# Slide 1 — Project Overview

## KijaniKiosk Payments Platform

Production-approaching DevOps capstone demonstrating:

* Kubernetes orchestration
* Serverless event processing
* Jenkins CI/CD automation
* AI-assisted operational analysis
* Production governance

---

# Slide 2 — Business Problem

### Challenge

Modern payment systems require:

* reliable deployments,
* scalable processing,
* asynchronous receipt generation,
* controlled production releases.

### Solution

A cloud-native platform combining Kubernetes, Serverless Framework, and automated CI/CD.

---

# Slide 3 — System Architecture

## Three-layer architecture

### Kubernetes Layer

* kk-api
* kk-payments
* NGINX Ingress
* ConfigMaps & Secrets

### Serverless Layer

* Generate Receipt
* Process Receipt
* Notify Customer
* Analytics Summary

### CI/CD Layer

* GitHub
* Jenkins
* Nexus
* Production Approval

---

# Slide 4 — Kubernetes Implementation

### Features implemented

* 3-replica payment deployment
* Rolling updates
* Rollback capability
* Readiness probes
* Liveness probes
* Ingress routing

### Result

Zero-downtime rolling deployment verified.

---

# Slide 5 — Serverless Workflow

### Event-driven receipt processing

Payment Request

↓

Receipt Generated

↓

Receipt Processed

↓

Notification

↓

Analytics Summary

### Benefit

Background processing improves scalability and reduces coupling.

---

# Slide 6 — CI/CD Pipeline

### Automated stages

1. Checkout
2. Lint
3. Build
4. Test
5. Security Audit
6. Publish to Nexus
7. Deploy to Staging
8. Manual Production Approval
9. Kubernetes Deployment

### Result

Successful production deployment with approval gate.

---

# Slide 7 — Governance & Risk

### Governance controls

* Manual production approval
* Human verification of AI outputs
* Git traceability
* Kubernetes rollout validation
* Deployment evidence retention

### Risk mitigated

Incorrect production image references were detected and corrected before release.

---

# Slide 8 — Project Outcomes

## Achievements

* Production-oriented Kubernetes platform
* Event-driven serverless processing
* Complete CI/CD pipeline
* Operational governance
* Deployment validation

### Thank You

Questions?
