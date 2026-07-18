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

# Credential Audit

A credential audit was performed on the final version of the CI pipeline.

The audit confirmed that:

- No usernames or passwords are hardcoded in the Jenkinsfile.
- Nexus credentials are retrieved securely using Jenkins Credentials Manager via the `withCredentials` step.
- A search of the Git repository found no hardcoded passwords, API keys, tokens, or secrets.
- Jenkins masks sensitive values during pipeline execution, preventing credentials from appearing in build logs.

The audit demonstrates that the pipeline follows secure credential management practices by keeping sensitive information out of source control and build output.

Below are the evidence to support my Audit Section:

1. From Jenkinsfile Publish stage:
   stage('Publish') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'nexus-credentials',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    ) 
                ]) {
2. Git commit history:

nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ git log --oneline
4e452af (HEAD -> main, origin/main) Add board documentation for CI pipeline
9b41aea fix(ci): restor publish stage
368a7a4 test(ci): inject publish stage failure
13ce613 fix(ci): restor test stage
c3807c6 test(ci): inject test stage failure
68e6c93 fix(ci): restor version stage
9e59253 test(ci): inject version stage failure
2534a10 fix(ci): restor build stage
b02227e test(ci): inject build stage failure
bbfba4d fix(ci): restore lint stage
dcbcb06 test(ci): inject lint stage failure
1852849 refactor(ci): remove temporary pipeline debugging
7e334d9 fix(ci): attach Jenkins agent to shared Docker network
0a02863 fix(ci): correct lint stage shell script syntax
4383ee7 chore(ci): remove stale npm config before dependency install
90a1547 chore(ci): print npm debug log on install failure
f8db26b chore(ci): add Node and npm diagnostics to pipeline
eed54ec chore(ci): add debug logging for Nexus npm publish
43dba3c Allow Git access in Jenkins workspace
533dfe7 Fix missing brace in Build stage
ca70093 Add git to CI image and prepare Nexus publish
1ba712f Fix stages block in Jenkinsfile
cc00bc0 Add versioning and Nexus publish stage
6a90d2a Prepare package version for CI publishing
da98729 Add Nexus publish stage
9ff2c11 Run Jenkins Docker agent as root
1891a06 Add Docker configuration files
ebfa449 Use custom Jenkins CI agent with Docker CLI
9406960 Add Docker image build stage to Jenkins pipeline
163d8ee Add start command for container deployment
23d4fe2 Upgrade CI runtime to Node 22 and clean build stage
62e6d05 Install dependencies before linting
ce28337 Add ESLint dependency
acfd317 Ignore build artifacts and npm configuration
7e442b0 Add lint stage and parallel verify stage
8b7eb99 feat: run pipeline in Docker agent
48c9988 test: verify Jenkins credential masking
4954cb2 Add artifact archiving stage
edc8344 test: remove deliberate failure test - CI pipeline verified
e3c60ef test: deliberate failure to verify CI pipeline stops on failure
3668f9e fix: clean Jenkinsfile
fecfdce fix: correct Jenkinsfile syntax

3. Audit Commands:

nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ git grep -n "password"
Jenkinsfile:145:                        passwordVariable: 'NEXUS_PASS'
Jenkinsfile:156:                   echo "//nexus:8081/repository/npm-kijanikiosk/:_password=$(printf "%s" "$NEXUS_PASS" | base64 -w0)" >> .npmrc
nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ git grep -n "NEXUS_PASS"
Jenkinsfile:145:                        passwordVariable: 'NEXUS_PASS'
Jenkinsfile:156:                   echo "//nexus:8081/repository/npm-kijanikiosk/:_password=$(printf "%s" "$NEXUS_PASS" | base64 -w0)" >> .npmrc
nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ git grep -n "secret"
nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ git grep -n "token"
git grep -n "apikey"
git grep -n "admin"
nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ touch CREDENTIAL_AUDIT.md
nancy@nancy-HP-EliteBook-840-G3:~/Development/code/dev14/kijanikiosk-payments$ 

4. Masking password console log output from the pipeline:

Masking supported pattern matches of $NEXUS_PASS
[Pipeline] {
[Pipeline] sh
+ set -eux
+ echo 'Publishing package to Nexus...'
Publishing package to Nexus...
+ echo 'registry=http://nexus:8081/repository/npm-kijanikiosk/'
+ echo 'always-auth=true'
+ echo '//nexus:8081/repository/npm-kijanikiosk/:username=admin'
+ printf '%s' ****
+ base64 -w0
+ echo '//nexus:8081/repository/npm-kijanikiosk/:_password=****'
+ echo '//nexus:8081/repository/npm-kijanikiosk/:email=ci@example.com'
+ echo '===== .npmrc ====='
===== .npmrc =====


# Credential Audit

A credential audit was performed on the final version of the CI pipeline.

The audit confirmed that:

- No usernames or passwords are hardcoded in the Jenkinsfile.
- Nexus credentials are retrieved securely using Jenkins Credentials Manager via the `withCredentials` step.
- A search of the Git repository found no hardcoded passwords, API keys, tokens, or secrets.
- Jenkins masks sensitive values during pipeline execution, preventing credentials from appearing in build logs.

The audit demonstrates that the pipeline follows secure credential management practices by keeping sensitive information out of source control and build output.

# Requirement 3 – Failure Injection Evidence

The following screenshots provide evidence of the deliberate failure injection tests performed on the Jenkins CI pipeline. Each failure was introduced intentionally to verify that Jenkins stops the pipeline at the failing stage and prevents downstream stages from executing. After each test, the original command was restored and the pipeline completed successfully.

---

## 1. Lint Stage Failure

**Fault Injected:** Changed `npm run lint` to `npm run linttt`.

**Result:** The Lint stage failed immediately, and all subsequent stages were skipped.

**Evidence:**

![Lint Stage Failure](file:///home/nancy/Pictures/Screenshots/Screenshot%20From%202026-07-18%2013-18-26.png)

---

## 2. Build Stage Failure

**Fault Injected:** Changed `npm run build` to `npm run buildd`.

**Result:** The Build stage failed, preventing the Version, Verify, Docker Build, Archive, and Publish stages from executing.

**Evidence:**

![Build Stage Failure](file:///home/nancy/Pictures/Screenshots/Screenshot%20From%202026-07-18%2013-26-27.png)

---

## 3. Version Stage Failure

**Fault Injected:** Changed `npm pack` to `npm packk`.

**Result:** The Version stage failed because `packk` is not a valid npm command. The remaining stages were skipped.

**Evidence:**

![Version Stage Failure](file:///home/nancy/Pictures/Screenshots/Screenshot%20From%202026-07-18%2015-47-13.png)

---

## 4. Test Stage Failure

**Fault Injected:** Changed `npm test` to `npm testt`.

**Result:** The Test stage failed, preventing Docker Build, Archive, and Publish from running.

**Evidence:**

![Test Stage Failure](file:///home/nancy/Pictures/Screenshots/Screenshot%20From%202026-07-18%2015-48-54.png)

---

## 5. Publish Stage Failure

**Fault Injected:** Changed `npm publish` to `npm publishh`.

**Result:** All previous stages completed successfully, but the Publish stage failed because the modified command does not exist.

**Evidence:**

![Publish Stage Failure](file:///home/nancy/Pictures/Screenshots/Screenshot%20From%202026-07-18%2015-50-23.png)

---

## Recovery

After each deliberate failure, the original command was restored:

- `npm run linttt` → `npm run lint`
- `npm run buildd` → `npm run build`
- `npm packk` → `npm pack`
- `npm testt` → `npm test`
- `npm publishh` → `npm publish`

Each restored pipeline completed successfully, demonstrating that the failures were isolated, intentional, and fully recoverable.

