import {ConnectionOptions} from "mongoose";
import {MDBConnection} from "./MDBConnection";

export interface IMDBOptions {
  url?: string;
  connectionOptions?: ConnectionOptions;
  /**
   * @deprecated
   */
  urls?: {[key: string]: MDBConnection & {id?: string}};
}
