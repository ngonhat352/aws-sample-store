import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StoreApiGateway } from './api-gateway';
import { StoreDatabase } from './database';
import { StoreMicroservices } from './microservices';

export class AwsSampleStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new StoreDatabase(this, 'StoreDatabase');                   // DynamoDB

    const microservices = new StoreMicroservices(this, 'StoreMicroservices', {   // Lambda
      productTable: database.productTable
    });

    const apigateway = new StoreApiGateway(this, 'StoreApiGateway', {            // API Gateway
      productMicroservice: microservices.productMicroservice,
    });
  }
}
