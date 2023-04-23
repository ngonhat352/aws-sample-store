import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface StoreMicroservicesProps {
    productTable: ITable;
    basketTable: ITable;
}

export class StoreMicroservices extends Construct {
    public readonly productMicroservice: NodejsFunction;
    public readonly basketMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: StoreMicroservicesProps) {
        super(scope, id);

        this.productMicroservice = this.createProductFunction(props.productTable);
        this.basketMicroservice = this.createBasketFunction(props.basketTable);
    }

    private createProductFunction(productTable: ITable): NodejsFunction {
        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: { externalModules: ['aws-sdk'] },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: productTable.tableName
            },
            runtime: Runtime.NODEJS_14_X
        }

        /** use NodejsFunction instead of normal Function from AWS Lambda 
        to access its bundling and packaging features
        Note: will require Docker Desktop */
        const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
            entry: join(__dirname, '..', 'backend', 'src', 'product', 'index.js'),
            ...nodeJsFunctionProps,
        })

        productTable.grantReadWriteData(productFunction);
        return productFunction;
    }

    private createBasketFunction(basketTable: ITable): NodejsFunction {
        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: { externalModules: ['aws-sdk'] },
            environment: {
                PRIMARY_KEY: 'userName',
                DYNAMODB_TABLE_NAME: basketTable.tableName
            },
            runtime: Runtime.NODEJS_14_X
        }

        const basketFunction = new NodejsFunction(this, 'basketLambdaFunction', {
            entry: join(__dirname, '..', 'backend', 'src', 'basket', 'index.js'),
            ...nodeJsFunctionProps,
        })

        basketTable.grantReadWriteData(basketFunction);
        return basketFunction;
    }
}