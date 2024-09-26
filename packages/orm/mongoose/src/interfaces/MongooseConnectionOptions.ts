import type {ConnectOptions} from "mongoose";

export interface MongooseConnectionOptions {
  url: string;
  /**
   * The connection ID
   */
  id: string;
  connectionOptions?: ConnectOptions;
}
