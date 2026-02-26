# Master Task List

## To Do
* [ ] Initialize Next.js frontend project.
* [ ] Create UI array for the 15 Sovereign Retirement questions.
* [ ] Build React state to track user score.
* [ ] Create API service in React to POST data to AWS.
* [ ] Build Results Page logic based on final score brackets.
* [ ] Embed scheduling widget on Results Page.

## In Progress
* [ ] Session 2: Frontend & Logic Integration.

## Done
* [x] Bootstrap AWS CDK environment (`cdk init`).
* [x] Write CDK code for DynamoDB table (Partition Key: `sessionId`).
* [x] Write CDK code for Lambda function (Scoring, DB write, & MailerLite API).
* [x] Write CDK code for API Gateway (POST endpoint).
* [x] Verify IAM permissions for Lambda to write to DynamoDB.
* [x] Create `.github/workflows/deploy.yml` for CI/CD.
* [x] Define PRD and Architecture.
* [x] Create local repository and documentation scaffold.
