import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

const awsServerlessExpress = require("aws-serverless-express");

// The function handler to setup on AWS Lambda console -- the name of this function must match the one configured on AWS
export const handler = async (event: any, context: any) => {
  const platform = await PlatformExpress.bootstrap(Server);
  const lambdaServer = awsServerlessExpress.createServer(platform.app.callback());

  return awsServerlessExpress.proxy(lambdaServer, event, context, "PROMISE").promise;
};
