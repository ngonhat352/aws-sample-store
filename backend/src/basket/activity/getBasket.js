import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbClient } from "../ddbClient";

export const getBasket = async (userName) => {
    console.log("getBasket");
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ userName: userName })
        };

        const { Item } = await ddbClient.send(new GetItemCommand(params));

        console.log(Item);
        return (Item) ? unmarshall(Item) : {};

    } catch (e) {
        console.error(e);
        throw e;
    }
}