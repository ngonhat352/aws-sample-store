import { getProduct } from "./activity/getProduct";
import { getProductsByCategory } from "./activity/getProductsByCategory";
import { getAllProducts } from "./activity/getAllProducts";
import { createProduct } from "./activity/createProduct";
import { deleteProduct } from "./activity/deleteProduct";
import { updateProduct } from "./activity/updateProduct";

// See event format and response format here: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters != null) {
          body = await getProductsByCategory(event); // GET product/1234?category=Phone
        }
        else if (event.pathParameters != null) {
          body = await getProduct(event.pathParameters.id); // GET product/{id}
        } else {
          body = await getAllProducts(); // GET product
        }
        break;
      case "POST":
        body = await createProduct(event); // POST /product
        break;
      case "DELETE":
        body = await deleteProduct(event.pathParameters.id); // DELETE /product/{id}
        break;
      case "PUT":
        body = await updateProduct(event); // PUT /product/{id}
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }

    console.log(body);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully finished operation: "${event.httpMethod}"`,
        body: body
      })
    };

  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to perform operation.",
        errorMsg: e.message,
        errorStack: e.stack,
      })
    };
  }
};
