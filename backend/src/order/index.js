import { createOrder } from "./activity/createOrder";
import { getAllOrders } from "./activity/getAllOrders";
import { getOrder } from "./activity/getOrder";

exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const eventType = event["detail-type"];
  if (eventType !== undefined) {
    // EventBridge Invocation
    await eventBridgeInvocation(event);
  } else {
    // API Gateway Invocation -- return sync response
    return await apiGatewayInvocation(event);
  }
};

const eventBridgeInvocation = async (event) => {
  console.log(`eventBridgeInvocation function. event : "${event}"`);

  // create order item into db
  await createOrder(event.detail);
};

const apiGatewayInvocation = async (event) => {
  let body;

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          body = await getOrder(event);
        } else {
          body = await getAllOrders();
        }
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }

    console.log(body);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body: body,
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to perform operation.",
        errorMsg: e.message,
        errorStack: e.stack,
      }),
    };
  }
};
