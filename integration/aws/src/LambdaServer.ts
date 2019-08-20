import {ServerLoader} from "@tsed/common";
import * as awsServerlessExpress from "aws-serverless-express";
import {Server} from "./Server";

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below, then redeploy (`npm run package-deploy`)
const binaryMimeTypes = [
  "application/javascript",
  "application/json",
  "application/octet-stream",
  "application/xml",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "text/comma-separated-values",
  "text/css",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/text",
  "text/xml"
];

// The function handler to setup on AWS Lambda console -- the name of this function must match the one configured on AWS
export async function awsHanlder(event: any, context: any, done: any) {
  const server = await ServerLoader.bootstrap(Server);
  const lambdaServer = awsServerlessExpress.createServer(server.expressApp, null, binaryMimeTypes);

  awsServerlessExpress.proxy(lambdaServer, event, context);

  done();
}
