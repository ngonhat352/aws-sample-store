import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "./ddbClient";

export const deleteProduct = async (productId) => {
    console.log(`deleteProduct function. productId : "${productId}"`);

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: productId }),
        };

        const deleteResult = await ddbClient.send(new DeleteItemCommand(params));

        console.log(deleteResult);
        return deleteResult;
    } catch (e) {
        console.error(e);
        throw e;
    }
}