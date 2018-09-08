import {ConnectionOptions} from "mongoose";

export interface MDBConnection {
  url: string;
  connectionOptions?: ConnectionOptions;
}
