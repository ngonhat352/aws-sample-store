import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps, NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export class AwsSampleStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------------------- Product microservice's DynamoDB ----------------------
    const productTable = new Table(this, 'product', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'product',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    // ---------------------- Product microservice's Lambda ---------------------------
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk' ]      },
      environment: {
        PRIMARY_KEY: 'id',
        DYNAMODB_TABLE_NAME: productTable.tableName
      },
      runtime: Runtime.NODEJS_14_X
    }

    /** use NodejsFunction instead of normal Function from AWS Lambda 
    to access its bundling and packaging features
    Note: will require Docker Desktop */
    const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
      entry: join(__dirname, '..','backend','src','product','index.js'),
      ...nodeJsFunctionProps,
    })
    productTable.grantReadWriteData(productFunction);

    // ---------------------- Product microservice's API Gateway ------------------------
    const apigw = new LambdaRestApi(this, 'productApi', {
      restApiName: 'Product Service',
      handler: productFunction,
      proxy: false
    });

    const product = apigw.root.addResource('product'); // root name product
    product.addMethod('GET'); // GET /product
    product.addMethod('POST');  // POST /product

    const singleProduct = product.addResource('{id}');
    singleProduct.addMethod('GET'); // GET /product/{id}
    singleProduct.addMethod('PUT'); // PUT /product/{id}
    singleProduct.addMethod('DELETE'); // DELETE /product/{id}
  }
}
