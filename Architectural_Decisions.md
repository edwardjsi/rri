# Architectural Decisions

* **Cloud Provider:** AWS (Chosen for robust serverless ecosystem and scalable infrastructure).
* **Deployment Region:** `ap-south-1` (Mumbai). Ensures the lowest latency and complies with local data residency preferences.
* **Infrastructure Management:** AWS CDK (TypeScript). Allows us to define infrastructure using familiar programming languages rather than manual console clicks, ensuring reproducibility.
* **CI/CD Tooling:** GitHub Actions. Seamlessly integrates with the code repository to trigger AWS CDK deployments automatically on a `git push`.
* **State Management:** React Context API / LocalStorage. Avoids heavy external state libraries (like Redux) to keep the frontend lightweight.
