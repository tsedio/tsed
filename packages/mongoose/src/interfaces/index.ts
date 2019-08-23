import {ConnectionOptions} from "mongoose";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: {
        url?: string;
        connectionOptions?: ConnectionOptions;
        // urls?: {[key: string]: MDBConnection};
      };
    }
  }
}

export * from "./MDBConnection";
export * from "./MongooseDocument";
export * from "./MongooseModel";
export * from "./MongooseModelOptions";
export * from "./MongooseSchema";
export * from "./MongooseSchemaOptions";
