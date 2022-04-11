import {ConnectionOptions} from "typeorm";

declare global {
  namespace TsED {
    interface Configuration {
      typeorm: ConnectionOptions[];
    }
  }
}
