import {ConnectionOptions} from "typeorm";

// tslint:disable-next-line: no-unused-variable
declare global {
  interface IServerSettings {
    typeorm: {[connectionName: string]: ConnectionOptions};
  }
}
