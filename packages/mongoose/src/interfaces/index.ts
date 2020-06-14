import {MDBConnection} from "./MDBConnection";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: Omit<MDBConnection, "id"> | MDBConnection[];
    }
  }
}

export * from "./MDBConnection";
export * from "./MongooseDocument";
export * from "./MongooseModel";
export * from "./MongooseModelOptions";
export * from "./MongooseSchemaOptions";
