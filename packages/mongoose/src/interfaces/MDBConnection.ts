import {ConnectionOptions} from "mongoose";

export interface MDBConnection {
  url: string;
  /**
   * The connection ID
   */
  id: string;
  connectionOptions?: ConnectionOptions;
}
