# PRD: Sovereign Retirement Reality Check™

## 1. Vision & Objective
To build a highly responsive, secure, and automated web-based assessment tool that calculates a user's financial "Fragility Score" and funnels high-earning individuals into booking a retirement roadmap consultation. 

## 2. Core Architecture (AWS Serverless)
* **Frontend:** React (Next.js) for static generation and fast load times.
* **Hosting & CDN:** AWS S3 and Amazon CloudFront.
* **API Layer:** Amazon API Gateway.
* **Compute Engine:** AWS Lambda (Node.js/TypeScript) to process scoring and routing.
* **Database:** Amazon DynamoDB to store assessment state and anonymized leads.
* **Infrastructure as Code:** AWS CDK (Cloud Development Kit).

## 3. Key Deliverables (3-Day Sprint)
* Fully functional 15-question interactive UI.
* Automated scoring logic rendering one of three archetypes.
* Lead capture form integrated with a database.
* CI/CD pipeline ensuring any code push automatically deploys to production.
