# Sovereign Retirement Reality Check™ (RRI)

An AWS serverless web application designed to assess financial resilience across Protection, Income, Market, and Inflation layers.

## Tech Stack
* **Frontend:** Next.js (React), Tailwind CSS, static export hosted on **Amazon S3 & CloudFront**
* **Backend:** AWS Lambda, API Gateway
* **Database:** DynamoDB
* **DevOps:** AWS CDK, local `deploy.sh` pipeline

## Quick Start (Local Development)
1. Clone the repository.
2. Ensure you are using Node.js >= 20.
3. Run `npm install` in the `/frontend` directory.
4. Run `npm run dev` to start the local Next.js server.
5. For infrastructure, navigate to `/infra` and use `cdk deploy` (requires AWS CLI configuration).

## Live Production URL
* **Application:** [https://d1q5pec0g09arc.cloudfront.net](https://d1q5pec0g09arc.cloudfront.net)
