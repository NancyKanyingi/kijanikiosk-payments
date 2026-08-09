# KijaniKiosk Kubernetes Deployment

## Namespace

All Kubernetes resources in this directory target:

`kijani-project`

Apply the manifests with:

    kubectl apply -f k8s/

## Secret Requirement

The `kk-payments-secrets` Secret is intentionally not committed to this repository.

It must be created manually before deploying `kk-payments`.

### Secret name

`kk-payments-secrets`

### Namespace

`kijani-project`

### Expected keys

- `DB_PASSWORD`
- `STRIPE_API_KEY`
- `JWT_SECRET`

Secret values must be obtained from the team before applying the deployment.

Example creation command:

    kubectl create secret generic kk-payments-secrets \
      --from-literal=DB_PASSWORD=<value> \
      --from-literal=STRIPE_API_KEY=<value> \
      --from-literal=JWT_SECRET=<value> \
      -n kijani-project

Do not commit real Secret values to Git.

## Deployment Architecture

- `kk-payments`: 3 replicas, ClusterIP port 3001
- `kk-api`: 2 replicas, ClusterIP port 8080
- External access: NGINX Ingress
- Host: `kijani.local`
