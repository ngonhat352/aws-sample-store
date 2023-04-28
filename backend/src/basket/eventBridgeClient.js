import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

// Create an Amazon EventBridge service client
export const ebClient = new EventBridgeClient();
