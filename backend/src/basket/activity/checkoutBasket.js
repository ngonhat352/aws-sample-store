import { PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { ebClient } from "../eventBridgeClient";
import { deleteBasket } from "./deleteBasket";
import { getBasket } from "./getBasket";

export const checkoutBasket = async (event) => {
  console.log("checkoutBasket");

  const checkoutRequest = JSON.parse(event.body);
  if (checkoutRequest == null || checkoutRequest.userName == null) {
    throw new Error(
      `userName should exist in checkoutRequest: "${checkoutRequest}"`
    );
  }

  // STEP 1: Get existing basket with items
  const basket = await getBasket(checkoutRequest.userName);

  // STEP 2: create orderPayload object to send to Order Lambda with basket items & totalPrice
  var orderPayload = prepareOrderPayload(checkoutRequest, basket);

  // STEP 3: publish event to eventbridge - this will subscribe by order microservice and start ordering process
  const publishedEvent = await publishCheckoutBasketEvent(orderPayload);

  // STEP 4: remove existing basket
  await deleteBasket(checkoutRequest.userName);
};

const prepareOrderPayload = (checkoutRequest, basket) => {
  console.log("prepareOrderPayload");

  // prepare order payload -> calculate totalprice and combine checkoutRequest and basket items
  // aggregate and enrich request and basket data in order to create order payload
  try {
    if (basket == null || basket.items == null) {
      throw new Error(`items should exist in basket: "${basket}"`);
    }

    // calculate totalPrice
    let totalPrice = 0;
    basket.items.forEach((item) => (totalPrice = totalPrice + item.price));
    checkoutRequest.totalPrice = totalPrice;
    console.log(checkoutRequest);

    // copies all properties from basket into checkoutRequest
    Object.assign(checkoutRequest, basket);
    console.log("Success prepareOrderPayload, orderPayload:", checkoutRequest);
    return checkoutRequest;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const publishCheckoutBasketEvent = async (checkoutPayload) => {
  console.log("publishCheckoutBasketEvent with payload :", checkoutPayload);
  try {
    // eventbridge parameters for setting event to target system
    const params = {
      Entries: [
        {
          Source: process.env.EVENT_SOURCE, //NOTE-N: from microservices.ts > createBasketFunction > Environments
          Detail: JSON.stringify(checkoutPayload),
          DetailType: process.env.EVENT_DETAILTYPE,
          Resources: [],
          EventBusName: process.env.EVENT_BUSNAME,
        },
      ],
    };

    const data = await ebClient.send(new PutEventsCommand(params));

    console.log("Success, event sent; requestID:", data);
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
