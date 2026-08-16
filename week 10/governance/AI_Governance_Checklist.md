# Week 10 – AI Governance Checklist

Project: KijaniKiosk Payments Platform

## 1. Project Context

The KijaniKiosk platform combines a Kubernetes-based payment service, a serverless receipt-processing workflow, and a Jenkins CI/CD pipeline with a manual production approval gate. AI assistance was used to support operational analysis and documentation, while all deployment decisions were verified before implementation.

---

## 2. Governance Controls

| Control | Status |
|---------|--------|
| AI used for a genuine operational task | ✓ |
| Human verification completed | ✓ |
| Infrastructure changes reviewed before commit | ✓ |
| Manual production approval required | ✓ |
| Deployment evidence retained | ✓ |
| Git history provides change traceability | ✓ |

---

## 3. AI-Assisted Operational Task

### Task

Analyse a simulated production incident affecting the `kk-payments` Kubernetes deployment.

### AI Support

AI was used to:

- identify the first observable failure in the incident timeline,
- explain the significance of the ConfigMap reload,
- determine whether scaling resolved the incident,
- summarise the sequence of operational events.

### Human Verification

The analysis was verified using:

- `kubectl describe deployment`
- `kubectl rollout status`
- Kubernetes Pod and ReplicaSet status
- Jenkins deployment console logs

Only verified conclusions were accepted.

---

## 4. Human Review Example

During CI/CD testing, the production deployment failed because Kubernetes attempted to pull a container image that did not exist. Investigation confirmed that the Jenkins deployment stage referenced an incorrect image tag.

The deployment pipeline was updated to use the validated Docker Hub production image, and the rollout was repeated successfully. Verification confirmed that all three replicas reached the **Running** state before the deployment was accepted.

---

## 5. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Incorrect deployment configuration | Manual review before commit |
| Invalid container image | Verified image reference before rollout |
| Unapproved production deployment | Jenkins manual approval gate |
| Incorrect operational diagnosis | Validation using Kubernetes evidence |

---

## 6. Governance Statement

AI was used as an engineering support tool rather than an autonomous decision maker. All production changes were reviewed, tested, and validated through Kubernetes rollout verification, Git version control, and a manual approval process before deployment.
0

