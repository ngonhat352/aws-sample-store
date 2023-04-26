import { EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface StoreEventBusProps {
  publisherFuntion: IFunction;
  targetFuntion: IFunction;
}

export class StoreEventBus extends Construct {
  constructor(scope: Construct, id: string, props: StoreEventBusProps) {
    super(scope, id);

    const bus = new EventBus(this, "SwnEventBus", {
      eventBusName: "SwnEventBus",
    });

    const checkoutBasketRule = new Rule(this, "CheckoutBasketRule", {
      eventBus: bus,
      enabled: true,
      description: "When Basket microservice checkout the basket",
      eventPattern: {
        source: ["com.swn.basket.checkoutbasket"],
        detailType: ["CheckoutBasket"],
      },
      ruleName: "CheckoutBasketRule",
    });

    // End Target of this bus (Order lambda) & rule
    checkoutBasketRule.addTarget(new LambdaFunction(props.targetFuntion));

    // allow the Event Source (Basket lambda) to put new events to this bus
    bus.grantPutEventsTo(props.publisherFuntion);
  }
}
