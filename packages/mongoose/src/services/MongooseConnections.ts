import {Configuration, registerProvider} from "@tsed/common";
import {isArray} from "@tsed/core";
import * as Mongoose from "mongoose";
import {IMDBOptions, MDBConnection} from "../interfaces";
import {MongooseService} from "../services/MongooseService";

// tslint:disable-next-line:variable-name
export const MONGOOSE_CONNECTIONS = Symbol.for("MONGOOSE_CONNECTIONS");
export type MONGOOSE_CONNECTIONS = MongooseService;

registerProvider({
  provide: MONGOOSE_CONNECTIONS,
  injectable: false,
  deps: [Configuration, MongooseService],
  async useAsyncFactory(configuration: Configuration, mongooseService: MongooseService) {
    const settings = configuration.get<IMDBOptions | MDBConnection[]>("mongoose");
    const promises: Promise<Mongoose.Mongoose>[] = [];
    let isDefault = true;

    const addConnection = (id: string, url: string, connectionOptions: any) => {
      promises.push(
        mongooseService.connect(
          id,
          url,
          connectionOptions || {
            useNewUrlParser: true,
            useUnifiedTopology: true
          },
          isDefault
        )
      );

      isDefault = false;
    };

    if (!isArray(settings)) {
      const {url, connectionOptions, urls} = settings || {};

      if (url) {
        addConnection("default", url, connectionOptions);
      }

      if (urls) {
        Object.entries(urls).forEach(([id, current]) => {
          addConnection(current.id || id, current.url, current.connectionOptions);
        });
      }
    } else {
      settings.forEach(current => {
        addConnection(current.id!, current.url!, current.connectionOptions);
      });
    }

    await Promise.all(promises);

    return mongooseService;
  }
});
