# KijaniKiosk Payments Service Level Indicators (SLIs) and Service Level Objectives (SLOs)

## Introduction

This document defines the proposed Service Level Indicators (SLIs) and Service Level Objectives (SLOs) for the KijaniKiosk Payments service. These targets are intended as an initial operational specification for the service. Because the project environment is a simulated laboratory rather than a production deployment, all targets are **proposed targets** and have **not yet been validated against production traffic**.

---

# SLI 1 – Availability

### Description

Availability measures whether the payment service is successfully responding to health requests.

### Data Source

* Nginx access logs
* Application `/health` endpoint
* Future monitoring platform (Prometheus or similar metrics system)

### Calculation Method

Availability (%) =

Successful health check responses (HTTP 200)

divided by

Total health check requests

multiplied by 100.

### Measurement Window

30-day rolling window.

### Proposed SLO

**Target:** **99.9% availability** over a rolling 30-day period.

---

# SLI 2 – Request Latency

### Description

Latency measures how quickly the payment service responds to incoming requests.

### Data Source

* Nginx access logs
* Application response timing
* Future metrics collection system

### Calculation Method

Calculate the percentage of requests completing within the acceptable response time.

### Measurement Window

30-day rolling window.

### Proposed SLO

**Target:** **95% of requests complete in less than 500 milliseconds** over a rolling 30-day period.

---

# SLI 3 – Payment Error Rate

### Description

Payment error rate measures the percentage of payment requests that fail because of server-side errors.

### Data Source

* Application logs
* HTTP status codes
* Future centralized monitoring system

### Calculation Method

Payment Error Rate (%) =

Server error responses (HTTP 5xx)

divided by

Total payment requests

multiplied by 100.

### Measurement Window

30-day rolling window.

### Proposed SLO

**Target:** **99.5% successful payment requests** (error rate below **0.5%**) over a rolling 30-day period.

---

# Automated Rollback Thresholds

| SLI                | Proposed 30-Day SLO          | Short-Window Rollback Threshold                                         | Relationship to SLO                                                                         |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Availability       | 99.9%                        | Three consecutive failed health checks                                  | Protects the long-term availability objective before customer impact becomes widespread.    |
| Latency            | 95% of requests below 500 ms | Three consecutive slow responses above the configured latency threshold | Prevents a degrading deployment from consuming the monthly latency budget.                  |
| Payment Error Rate | Less than 0.5% errors        | Error rate exceeding 5% during the monitoring window                    | Stops a faulty deployment before it significantly affects the long-term reliability target. |

---

# What We Do Not Commit To

## CPU Utilization

CPU utilization is monitored for operational awareness but is not itself a customer-facing service objective. High CPU usage is acceptable provided customer requests continue meeting the availability and latency objectives.

## Memory Consumption

Memory usage is observed to detect resource problems and memory leaks, but no service commitment is made for memory consumption alone. The objective is reliable payment processing rather than maintaining a specific memory usage level.

---

# Summary

These proposed SLIs and SLOs establish measurable objectives for the KijaniKiosk Payments service while defining clear automated rollback thresholds for unhealthy deployments. As production monitoring data becomes available, these proposed targets should be reviewed and refined using real operational measurements.
