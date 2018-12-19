import {ConnectionOptions} from "mongoose";
import {MDBConnection} from "./interfaces";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    mongoose: {
      url?: string;
      connectionOptions?: ConnectionOptions;
      urls?: {[key: string]: MDBConnection};
    };
  }
}

export * from "./interfaces";
export * from "./registries/MongooseModelRegistry";
export * from "./services/MongooseService";
export * from "./utils";
export * from "./decorators";
