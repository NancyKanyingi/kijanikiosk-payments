# Board Demonstration Script

**[Stage Direction: Start the deployment pipeline and display the application dashboard.]**

**Nia:**
"Today we'll show how a new software version is released without interrupting the service our customers depend on. The new version is prepared alongside the current one so we can confirm it is healthy before anyone is affected."

---

**[Stage Direction: Pipeline deploys the new version to the inactive environment.]**

**Nia:**
"The new version has now been installed separately from the live service. Before anyone uses it, the system checks that it is working correctly and responding as expected."

---

**[Stage Direction: Execute the blue/green traffic switch.]**

**Nia:**
"Now the system moves customer traffic to the new version. This change happens without stopping the service, so customers continue using the application while the upgrade takes place."

---

**[Stage Direction: Stop the green service to simulate a deployment failure.]**

**Nia:**
"To demonstrate resilience, we are now introducing a fault into the newly deployed version. This represents the type of problem that might only become visible after a release."

---

**[Stage Direction: Post-deployment monitor detects the failure and automatically executes rollback.]**

**Nia:**
"The system immediately detects that the new version is unhealthy and automatically restores the previous version. No one needs to intervene, reducing both response time and the risk of human error."

---

**[Stage Direction: Display the health endpoint showing version 1.3.0 after rollback.]**

**Nia:**
"The previous version was restored in **2 seconds**, faster than a person could have responded. This approach helps protect customers, reduces business risk, and allows our team to deliver improvements with greater confidence."
