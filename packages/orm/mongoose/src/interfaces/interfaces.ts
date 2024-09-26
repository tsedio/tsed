import type {MongooseConnectionOptions} from "./MongooseConnectionOptions.js";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: Omit<MongooseConnectionOptions, "id"> | MongooseConnectionOptions[];
    }
  }
}
