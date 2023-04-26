import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface StoreApiGatewayProps {
  productMicroservice: IFunction;
  basketMicroservice: IFunction;
  orderMicroservice: IFunction;
}

export class StoreApiGateway extends Construct {
  constructor(scope: Construct, id: string, props: StoreApiGatewayProps) {
    super(scope, id);
    this.createProductApi(props.productMicroservice);
    this.createBasketApi(props.basketMicroservice);
    this.createOrderApi(props.orderMicroservice);
  }

  private createProductApi(productMicroservice: IFunction) {
    const apigw = new LambdaRestApi(this, "productApi", {
      restApiName: "Product Service",
      handler: productMicroservice,
      proxy: false,
    });

    const product = apigw.root.addResource("product"); // root name: 'product'
    product.addMethod("GET"); // GET /product
    product.addMethod("POST"); // POST /product

    const singleProduct = product.addResource("{id}"); // product/{id}
    singleProduct.addMethod("GET"); // GET /product/{id}
    singleProduct.addMethod("PUT"); // PUT /product/{id}
    singleProduct.addMethod("DELETE"); // DELETE /product/{id}
  }

  private createBasketApi(basketMicroservice: IFunction) {
    const apigw = new LambdaRestApi(this, "basketApi", {
      restApiName: "Basket Service",
      handler: basketMicroservice,
      proxy: false,
    });

    const basket = apigw.root.addResource("basket"); // root name: 'basket'
    basket.addMethod("GET"); // GET /basket
    basket.addMethod("POST"); // POST /basket

    const singleBasket = basket.addResource("{userName}");
    singleBasket.addMethod("GET"); // GET /basket/{userName}
    singleBasket.addMethod("DELETE"); // DELETE /basket/{userName}

    const basketCheckout = basket.addResource("checkout");
    basketCheckout.addMethod("POST"); // POST /basket/checkout
  }

  private createOrderApi(orderMicroservice: IFunction) {
    const apigw = new LambdaRestApi(this, "orderApi", {
      restApiName: "Order Service",
      handler: orderMicroservice,
      proxy: false,
    });

    const order = apigw.root.addResource("order"); // root name: order
    order.addMethod("GET"); // GET /order

    const singleOrder = order.addResource("{userName}");
    singleOrder.addMethod("GET"); // GET /order/{userName}
    // expected request : xxx/order/ngonhat352?orderDate=timestamp

    return singleOrder;
  }
}
