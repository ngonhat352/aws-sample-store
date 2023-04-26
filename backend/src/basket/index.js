import { checkoutBasket } from "./activity/checkoutBasket";
import { createBasket } from "./activity/createBasket";
import { deleteBasket } from "./activity/deleteBasket";
import { getAllBaskets } from "./activity/getAllBaskets";
import { getBasket } from "./activity/getBasket";

exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  let body;

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.pathParameters != null) {
          body = await getBasket(event.pathParameters.userName); // GET /basket/{userName}
        } else {
          body = await getAllBaskets(); // GET /basket
        }
        break;
      case "POST":
        if (event.path == "/basket/checkout") {
          body = await checkoutBasket(event); // POST /basket/checkout
        } else {
          body = await createBasket(event); // POST /basket
        }
        break;
      case "DELETE":
        body = await deleteBasket(event.pathParameters.userName); // DELETE /basket/{userName}
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
