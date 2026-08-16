# Week 10 – Peer Feedback & Human Review Log

**Project:** KijaniKiosk Payments Platform

## Review Summary

A structured review was carried out before final submission to identify implementation issues affecting deployment reliability, configuration management, and production readiness.

---

## Review Item 1 – Production Image Reference

**Issue identified**

The production deployment attempted to use a container image tag that did not exist, resulting in failed image pulls during the Kubernetes rollout.

**Resolution**

The deployment configuration was updated to reference the validated Docker Hub production image (`docker.io/nancykanyingi/kk-payments:v1.1.0`), after which the rollout completed successfully.

**Verification**

* Kubernetes rollout completed successfully.
* All three replicas reached the **Running** state.

---

## Review Item 2 – Kubernetes Configuration Access

**Issue identified**

The Jenkins deployment stage could not communicate with the Minikube cluster because the Kubernetes configuration referenced certificate locations that were unavailable inside the CI environment.

**Resolution**

The deployment stage was updated to use the correct Kubernetes configuration before executing `kubectl apply` and rollout verification.

**Verification**

* Jenkins successfully applied the deployment.
* Kubernetes accepted the updated manifest.

---

## Review Item 3 – Manual Production Approval

**Issue identified**

Initial pipeline testing revealed uncertainty around where production approval appeared within the Jenkins interface, creating the risk of unattended deployments timing out.

**Resolution**

The pipeline was validated using the Jenkins **Input** approval stage, and production deployment proceeded only after explicit user approval.

**Verification**

* Manual approval recorded in Jenkins.
* Deployment continued only after approval was granted.

---

## Outcome

The review process improved deployment reliability, strengthened production governance, and confirmed that the CI/CD pipeline required both technical validation and human approval before releasing changes to the Kubernetes environment.
