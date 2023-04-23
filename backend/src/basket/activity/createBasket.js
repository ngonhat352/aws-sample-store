import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../ddbClient";

export const createBasket = async (event) => {
    console.log(`createBasket function. event : "${event}"`);
    try {
        const requestBody = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(requestBody || {})
        };

        const createResult = await ddbClient.send(new PutItemCommand(params));
        console.log(createResult);
        return createResult;

    } catch (e) {
        console.error(e);
        throw e;
    }
}