import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../ddbClient";

export const getAllOrders = async () => {
  console.log("getAllOrders");
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    const { Items } = await ddbClient.send(new ScanCommand(params));

    console.log(Items);
    return Items ? Items.map((item) => unmarshall(item)) : {};
  } catch (e) {
    console.error(e);
    throw e;
  }
};
