import {ServerLoader} from "@tsed/common";
import {Server} from "./Server";

const awsServerlessExpress = require("aws-serverless-express");

// The function handler to setup on AWS Lambda console -- the name of this function must match the one configured on AWS
export const handler = async (event: any, context: any, done: any) => {
  const server = await ServerLoader.bootstrap(Server);
  const lambdaServer = awsServerlessExpress.createServer(server.expressApp);

  awsServerlessExpress.proxy(lambdaServer, event, context);

  done();
};
