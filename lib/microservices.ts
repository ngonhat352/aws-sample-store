import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface StoreMicroservicesProps {
    productTable: ITable;
}

export class StoreMicroservices extends Construct {
    public readonly productMicroservice: NodejsFunction;

    constructor(scope: Construct, id: string, props: StoreMicroservicesProps) {
        super(scope, id);

        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: { externalModules: ['aws-sdk'] },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_14_X
        }

        /** use NodejsFunction instead of normal Function from AWS Lambda 
        to access its bundling and packaging features
        Note: will require Docker Desktop */
        const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
            entry: join(__dirname, '..','backend','src','product','index.js'),
            ...nodeJsFunctionProps,
        })

        props.productTable.grantReadWriteData(productFunction);

        this.productMicroservice = productFunction;
    }
}