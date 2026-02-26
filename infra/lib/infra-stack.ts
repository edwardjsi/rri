import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. DynamoDB Table
    const table = new dynamodb.Table(this, 'RRIAssessments', {
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // WARNING: Change to RETAIN for production data safety
    });

    // 2. Lambda Function
    const scoringFunction = new lambda.Function(this, 'ScoringFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../backend')),
      environment: {
        TABLE_NAME: table.tableName,
        MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY || 'dummy-key',
      },
      timeout: cdk.Duration.seconds(15),
    });

    // Grant Lambda permissions to put items in DynamoDB
    table.grantWriteData(scoringFunction);

    // 3. API Gateway
    const api = new apigateway.RestApi(this, 'RRIApi', {
      restApiName: 'RRI Service',
      description: 'Submits user assessment and routes to MailerLite',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const submitIntegration = new apigateway.LambdaIntegration(scoringFunction);

    const submitPath = api.root.addResource('submit');
    submitPath.addMethod('POST', submitIntegration);

    // 4. Frontend Hosting (S3 + CloudFront)
    const websiteBucket = new s3.Bucket(this, 'RRIFrontendBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const distribution = new cloudfront.Distribution(this, 'RRIFrontendDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    new s3deploy.BucketDeployment(this, 'DeployRRIFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend/out'))],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Output the Deployment URLs
    new cdk.CfnOutput(this, 'FrontendURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'Production URL for the Sovereign Retirement Assessment App',
    });
  }
}
