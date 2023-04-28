import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StoreApiGateway } from "./api-gateway";
import { StoreDatabase } from "./database";
import { StoreEventBus } from "./event-bus";
import { StoreMicroservices } from "./microservices";

export class AwsSampleStoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const database = new StoreDatabase(this, "StoreDatabase");

    // Lambda
    const microservices = new StoreMicroservices(this, "StoreMicroservices", {
      productTable: database.productTable,
      basketTable: database.basketTable,
      orderTable: database.orderTable,
    });

    // API Gateway
    const apigateway = new StoreApiGateway(this, "StoreApiGateway", {
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderMicroservice: microservices.orderMicroservice,
    });

    // EventBus
    const eventbus = new StoreEventBus(this, "StoreEventBus", {
      publisherFuntion: microservices.basketMicroservice,
      targetFuntion: microservices.orderMicroservice,
    });
  }
}
