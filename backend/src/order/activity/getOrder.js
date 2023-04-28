import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../ddbClient";

export const getOrder = async (event) => {
  console.log("getOrder");

  try {
    // expected request : /order/ngonhat352?orderDate=timestamp
    const userName = event.pathParameters.userName;
    const orderDate = event.queryStringParameters.orderDate;

    //TODO: turn orderDate into instant, query by < > instead of =
    const params = {
      KeyConditionExpression: "userName = :userName and orderDate = :orderDate",
      ExpressionAttributeValues: {
        ":userName": { S: userName },
        ":orderDate": { S: orderDate },
      },
      TableName: process.env.DYNAMODB_TABLE_NAME, //NOTE-N: this is from line 34 in file microservice.ts (createProductFunction > Environment)
    };

    const { Items } = await ddbClient.send(new QueryCommand(params));

    console.log(Items);
    return Items.map((item) => unmarshall(item));
  } catch (e) {
    console.error(e);
    throw e;
  }
};
