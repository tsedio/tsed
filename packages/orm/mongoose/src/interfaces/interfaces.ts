import {MongooseConnectionOptions} from "./MongooseConnectionOptions";

declare global {
  namespace TsED {
    interface Configuration {
      mongoose: Omit<MongooseConnectionOptions, "id"> | MongooseConnectionOptions[];
    }
  }
}
