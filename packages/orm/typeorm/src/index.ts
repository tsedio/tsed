import {ConnectionOptions} from "typeorm";

declare global {
  namespace TsED {
    interface Configuration {
      typeorm: ConnectionOptions[];
    }
  }
}
export * from "./utils/createConnection";
export * from "./services/TypeORMService";
export * from "./decorators/useConnection";
export * from "./TypeORMModule";
