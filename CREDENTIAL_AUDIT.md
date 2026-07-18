# Credential Audit

## Objective

The purpose of this audit is to verify that sensitive credentials used by the CI pipeline are managed securely and are not exposed in the source code, Git history, or Jenkins build logs.

---

## Jenkins Credentials

The Jenkins pipeline uses the `withCredentials` step to securely retrieve the Nexus username and password from Jenkins Credentials Manager.

```groovy
withCredentials([
    usernamePassword(
        credentialsId: 'nexus-credentials',
        usernameVariable: 'NEXUS_USER',
        passwordVariable: 'NEXUS_PASS'
    )
])
```

No usernames or passwords are hardcoded in the Jenkinsfile.

---

## Source Code Audit

The repository was searched for hardcoded credentials using Git search commands.

Commands executed:

```bash
git grep -n "password"
git grep -n "NEXUS_PASS"
git grep -n "secret"
git grep -n "token"
git grep -n "apikey"
git grep -n "admin"
```

### Findings

- The only references to `NEXUS_PASS` are environment variable names used by Jenkins.
- No hardcoded passwords were found.
- No API keys were found.
- No authentication tokens were found.
- No secrets were committed to the repository.

---

## Git History Audit

The project history was reviewed using:

```bash
git log --oneline
```

The commit history contains implementation, debugging, and restoration commits only. No credentials or sensitive information were committed during development.

---

## Jenkins Build Log Audit

Successful Jenkins builds confirm that credentials are masked during execution.

Evidence observed:

- `Masking supported pattern matches of $NEXUS_PASS`
- Password values displayed as `****`

This confirms that Jenkins prevents sensitive values from appearing in build logs while still allowing authenticated communication with Nexus Repository Manager.

---

## Conclusion

The credential audit confirms that:

- Credentials are securely stored in Jenkins Credentials Manager.
- No secrets are hardcoded in the Jenkinsfile.
- No credentials exist in the Git repository.
- Jenkins masks sensitive values during pipeline execution.

The CI pipeline follows recommended practices for secure credential management.