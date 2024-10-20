import type {Context} from "aws-lambda";

export function createFakeContext(context?: Context): Context {
  return {
    awsRequestId: "awsRequestId",
    callbackWaitsForEmptyEventLoop: false,
    functionName: "",
    functionVersion: "",
    invokedFunctionArn: "",
    logGroupName: "",
    logStreamName: "",
    memoryLimitInMB: "",
    ...(context || {})
  } as Context;
}
