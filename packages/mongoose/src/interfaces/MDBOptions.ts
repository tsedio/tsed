import {ConnectionOptions} from "mongoose";
import {MDBConnection} from "./MDBConnection";

export interface IMDBOptions {
  url?: string;
  connectionOptions?: ConnectionOptions;
  urls?: {[key: string]: MDBConnection};
}
