import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../ddbClient";

//TODO: create a Global Secondary Index on category, then query by index category on that indexed tabled
// NOTE-N: GSI vs LSI https://medium.com/@jun711.g/aws-dynamodb-global-and-local-secondary-indexes-comparison-80f4c587b1d7
export const getProductsByCategory = async (event) => {
  console.log("getProductsByCategory");
  try {
    // GET product/?category=Car
    const category = event.queryStringParameters.category;

    const params = {
      KeyConditionExpression: "category = :category",
      ExpressionAttributeValues: {
        ":category": { S: category },
      },
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    const { Items } = await ddbClient.send(new QueryCommand(params));

    console.log(Items);
    return Items.map((item) => unmarshall(item));
  } catch (e) {
    console.error(e);
    throw e;
  }
};
