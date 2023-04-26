#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { AwsSampleStoreStack } from "../lib/aws-sample-store-stack";

const app = new cdk.App();
new AwsSampleStoreStack(app, "AwsSampleStoreStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
