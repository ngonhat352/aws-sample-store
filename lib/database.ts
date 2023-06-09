import { RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  ITable,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class StoreDatabase extends Construct {
  public readonly productTable: ITable;
  public readonly basketTable: ITable;
  public readonly orderTable: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Product DynamoDB Table Creation
    const productTable = new Table(this, "product", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "product",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.productTable = productTable;

    // Basket DynamoDB Table Creation
    const basketTable = new Table(this, "basket", {
      partitionKey: {
        name: "userName",
        type: AttributeType.STRING,
      },
      tableName: "basket",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.basketTable = basketTable;

    // Order DynamoDb Table Creation
    const orderTable = new Table(this, "order", {
      partitionKey: {
        name: "userName",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "orderDate",
        type: AttributeType.STRING,
      },
      tableName: "order",
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.orderTable = orderTable;
  }
}
