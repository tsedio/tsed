import "@tsed/common";
import {ConnectionOptions} from "typeorm";

declare global {
  namespace TsED {
    interface Configuration {
      typeorm: ConnectionOptions[];
    }
  }
}

export * from "./services/TypeORMService";
export * from "./TypeORMModule";
