# KijaniKiosk Payments CI Pipeline Documentation

## Introduction

This document explains how the KijaniKiosk Payments Continuous Integration (CI) pipeline works from the moment a developer submits new code until a versioned software package is produced and stored. The goal of this pipeline is to automatically verify that every code change is safe, functional, and ready for future deployment. By automating these checks, the development team reduces human error, maintains software quality, and ensures that every published package has passed the same validation process.

Rather than relying on manual testing, the pipeline performs a consistent series of automated checks every time new code is pushed to the GitHub repository. If any step fails, the process immediately stops, preventing defective software from progressing further.

---

# Pipeline Overview

The pipeline begins whenever a developer pushes new code to the GitHub repository. Jenkins automatically detects the change and starts a new pipeline run inside a dedicated Docker container. Using Docker ensures that every build runs inside the same clean environment regardless of the machine hosting Jenkins.

The pipeline then executes several stages that progressively increase confidence that the application is working correctly. Each stage must complete successfully before the next stage begins.

---

# Pipeline Stages

| Stage | Purpose | What it Confirms |
|--------|---------|------------------|
| Lint | Checks source code formatting and coding standards | Code follows agreed coding practices |
| Build | Creates the application package | The application can be successfully built |
| Version | Generates a uniquely versioned release package | Every artifact is traceable to a specific commit |
| Verify | Confirms the build artifact exists | The expected package was created |
| Test | Runs automated application tests | Core application behaviour works correctly |
| Security Audit | Checks project dependencies for known vulnerabilities | No known high-severity dependency issues exist |
| Docker Build | Builds the Docker image | The application can run inside a container |
| Publish | Uploads the packaged application to Nexus Repository | A versioned artifact is stored for future deployment |

---

# From Code Commit to Published Artifact

The process starts when a developer pushes changes to GitHub. Jenkins automatically checks out the latest version of the project and launches a Docker-based build agent. Running inside Docker guarantees that every build uses the same versions of Node.js, npm, and supporting tools.

The first validation step installs all project dependencies and checks the source code against the team's coding standards. If formatting or syntax issues are detected, the pipeline stops immediately.

After passing the lint stage, Jenkins builds the application and produces a distributable package. The package version incorporates the current Git commit identifier, making every artifact uniquely identifiable and traceable back to the exact source code that created it.

The pipeline then verifies that the expected build artifacts were successfully generated before continuing.

Next, automated unit tests execute to confirm that the application's core functionality still behaves as expected. At the same time, an automated dependency security audit scans third-party packages for publicly known vulnerabilities.

If all quality checks succeed, Jenkins builds a Docker image containing the application. This image represents the same software that can later be deployed to production environments.

Finally, Jenkins publishes the packaged application to the Nexus Repository Manager. Nexus stores versioned artifacts centrally so that future deployments always use validated, reproducible software rather than rebuilding directly from source code.

---

# What Happens When Something Goes Wrong

The pipeline is intentionally designed to stop as soon as an error is detected. This prevents invalid software from progressing to later stages where additional time and computing resources would be wasted.

For example, if the coding standards check fails, the build, testing, Docker image creation, and publishing stages are all skipped automatically. Similarly, if the build cannot produce a valid application package, testing and publishing do not occur.

During development, deliberate failures were introduced into each pipeline stage to confirm this behaviour. In every case, Jenkins immediately halted execution, reported the failing stage, skipped all downstream stages, and marked the overall pipeline as failed. Once each issue was corrected, the pipeline successfully completed and produced the expected published artifact.

This behaviour ensures that only software that has passed every quality gate can be stored for future deployment.

---

# Current Scope and Limitations

Although the pipeline provides a strong automated quality assurance process, it does not yet perform every activity required for a complete production deployment.

For example, the pipeline currently does not:

- Deploy the application to development, staging, or production environments.
- Execute integration or end-to-end testing.
- Perform automated performance or load testing.
- Scan the Docker image itself for security vulnerabilities.
- Support automatic rollback if a deployment fails.

These capabilities could be added in future iterations as the project grows.

---

# Conclusion

The KijaniKiosk Payments CI pipeline provides a reliable and repeatable process for validating software changes before they are accepted as release artifacts. Every code change follows the same sequence of automated quality checks, reducing manual effort while increasing confidence in the software being produced.

By combining Jenkins automation, Docker-based build environments, automated testing, dependency security auditing, artifact versioning, and Nexus Repository storage, the pipeline creates a controlled software delivery process where every published artifact has been consistently verified and can be traced back to its original source code.

This approach improves software quality, increases developer productivity, and establishes a solid foundation for future continuous delivery and automated deployment practices.