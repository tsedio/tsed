import {ConnectionOptions} from "typeorm";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    typeorm: {[connectionName: string]: ConnectionOptions};
  }
}

export * from "./services/TypeORMService";
export * from "./TypeORMModule";
