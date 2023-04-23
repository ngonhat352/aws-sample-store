import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface StoreApiGatewayProps {
    productMicroservice: IFunction
}

export class StoreApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: StoreApiGatewayProps) {
        super(scope, id);

        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName: 'Product Service',
            handler: props.productMicroservice,
            proxy: false
        });

        const product = apigw.root.addResource('product'); // root name product
        product.addMethod('GET'); // GET /product
        product.addMethod('POST');  // POST /product

        const singleProduct = product.addResource('{id}');
        singleProduct.addMethod('GET'); // GET /product/{id}
        singleProduct.addMethod('PUT'); // PUT /product/{id}
        singleProduct.addMethod('DELETE'); // DELETE /product/{id}


    }
}