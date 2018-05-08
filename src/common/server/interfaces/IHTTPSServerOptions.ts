import * as Https from "https";

export interface IHTTPSServerOptions extends Https.ServerOptions {
  port: string | number;
}
