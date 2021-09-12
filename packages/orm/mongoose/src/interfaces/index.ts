import {MongooseConnectionOptions} from "./MongooseConnectionOptions";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: Omit<MongooseConnectionOptions, "id"> | MongooseConnectionOptions[];
    }
  }
}

export * from "./MongooseConnectionOptions";
export * from "./MongooseDocument";
export * from "./MongooseModel";
export * from "./MongooseModelOptions";
export * from "./MongooseSchemaOptions";
export * from "./MongooseVirtualRefOptions";
