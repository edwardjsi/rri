import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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
  }
}
