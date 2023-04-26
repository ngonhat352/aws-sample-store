import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Amazon DynamoDB client module
const ddbClient = new DynamoDBClient();
export { ddbClient };
