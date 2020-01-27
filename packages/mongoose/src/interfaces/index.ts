import {IMDBOptions} from "./MDBOptions";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: IMDBOptions;
    }
  }
}
export * from "./MDBOptions";
export * from "./MDBConnection";
export * from "./MongooseDocument";
export * from "./MongooseModel";
export * from "./MongooseModelOptions";
export * from "./MongooseSchemaOptions";
