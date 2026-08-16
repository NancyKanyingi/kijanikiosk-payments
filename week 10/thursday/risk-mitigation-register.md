# Risk Mitigation Register

Project: KijaniKiosk Payment Receipts Infrastructure

Date: 2026-08-14

---

## Risk Mitigation Entry 1: Hardcoded Database Password

Risk: The Lambda function stores the production database password directly in Terraform source code, exposing sensitive credentials to anyone with repository access.

Likelihood: High — Hardcoded secrets are commonly exposed through Git history, pull requests, backups, and cloned repositories.

Impact: An attacker could gain access to the KijaniKiosk production database and read or modify payment records, resulting in data compromise and service disruption.

Mitigation: In the `aws_lambda_function.receipt_processor` resource, replace:

```terraform
DB_PASSWORD = "kijani-prod-password-2024"
```

with:

```terraform
DB_PASSWORD = var.db_password
```

Add the following variable to `variables.tf`:

```terraform
variable "db_password" {
  type      = string
  sensitive = true
}
```

Store the actual password in AWS Secrets Manager (or a `.tfvars` file excluded from Git using `.gitignore`) instead of committing it to source control.

Residual Risk: The password still requires rotation, access control, and monitoring, but it is no longer exposed in the repository.

---

## Risk Mitigation Entry 2: Overly Broad IAM Permissions

Risk: The IAM role grants `s3:*` on all resources (`"*"`), violating the principle of least privilege and allowing unrestricted S3 access.

Likelihood: High — If the Lambda function or IAM role is compromised, an attacker immediately inherits excessive permissions across the AWS account.

Impact: A compromised receipt processor could delete, overwrite, or exfiltrate data from unrelated S3 buckets, significantly increasing the blast radius of an incident.

Mitigation: In the `aws_iam_role_policy.receipts_processor_policy` resource, replace:

```terraform
Action   = ["s3:*"]
Resource = ["*"]
```

with:

```terraform
Action = [
  "s3:GetObject",
  "s3:PutObject",
  "s3:ListBucket"
]

Resource = [
  aws_s3_bucket.payment_receipts.arn,
  "${aws_s3_bucket.payment_receipts.arn}/*"
]
```

This restricts the Lambda function to only the payment receipts bucket and only the operations required for receipt processing.

Residual Risk: The Lambda still has access to the payment receipts bucket, so continuous monitoring, audit logging, and periodic IAM reviews remain necessary.