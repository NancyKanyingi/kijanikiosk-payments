# Week 10 – Capstone Reflection

## KijaniKiosk Payments Platform

### Reflection

Completing the KijaniKiosk Payments Platform provided practical experience in designing, deploying, and operating a production-oriented DevOps solution. The project combined Infrastructure as Code, containerization, Kubernetes orchestration, serverless computing, CI/CD automation, and operational governance into a single workflow. Rather than treating these technologies as separate topics, the capstone demonstrated how they work together to support reliable software delivery.

One of the most significant lessons was the importance of verification throughout the deployment lifecycle. During pipeline testing, production deployment did not succeed immediately because Kubernetes attempted to deploy an invalid container image reference. Investigating the failure required examining Jenkins console logs, Kubernetes rollout status, ReplicaSets, and Pod events before identifying the configuration issue. Correcting the deployment and confirming a successful rolling rollout reinforced the value of evidence-based troubleshooting instead of relying on assumptions.

The project also strengthened my understanding of Kubernetes as an operational platform rather than simply a container scheduler. Implementing ConfigMaps, Secrets, health probes, rolling updates, Ingress routing, and rollback procedures demonstrated how production services maintain availability while new versions are introduced. Observing the behaviour of failed rollouts and recovery procedures provided valuable insight into deployment resilience.

Another important area of learning was event-driven architecture. By separating receipt generation from payment processing through serverless functions, the system became more scalable and loosely coupled. The asynchronous workflow illustrated how background processing can improve application responsiveness while supporting notifications and analytics independently of the payment transaction.

The CI/CD pipeline highlighted the importance of governance in modern software delivery. Automated linting, testing, security auditing, artifact publishing, and manual production approval created a controlled deployment process that balanced automation with human oversight. This demonstrated that continuous delivery is not only about speed but also about traceability, accountability, and operational safety.

Overall, the capstone significantly improved my confidence in applying DevOps principles to real-world engineering problems. I gained practical experience integrating multiple technologies into a cohesive platform while developing stronger skills in deployment automation, operational debugging, infrastructure management, and production governance. These experiences have provided a solid foundation for building and maintaining cloud-native applications in professional environments.
