import "@tsed/common";
import {ConnectionOptions} from "typeorm";

declare module "@tsed/common" {
  interface IServerSettingsOptions {
    typeorm: ConnectionOptions[];
  }
}

export * from "./services/TypeORMService";
export * from "./TypeORMModule";
