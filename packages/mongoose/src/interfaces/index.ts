import {MDBConnection} from "./MDBConnection";
import {IMDBOptions} from "./MDBOptions";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: IMDBOptions | MDBConnection[];
    }
  }
}
export * from "./MDBOptions";
export * from "./MDBConnection";
export * from "./MongooseDocument";
export * from "./MongooseModel";
export * from "./MongooseModelOptions";
export * from "./MongooseSchemaOptions";
