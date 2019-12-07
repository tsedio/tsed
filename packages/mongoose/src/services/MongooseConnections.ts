import {Configuration, registerProvider} from "@tsed/common";
import * as Mongoose from "mongoose";
import {IMDBOptions} from "../interfaces";
import {MongooseService} from "../services/MongooseService";

// tslint:disable-next-line:variable-name
export const MONGOOSE_CONNECTIONS = Symbol.for("MONGOOSE_CONNECTIONS");
export type MONGOOSE_CONNECTIONS = MongooseService;

registerProvider({
  provide: MONGOOSE_CONNECTIONS,
  injectable: false,
  deps: [Configuration, MongooseService],
  async useAsyncFactory(configuration: Configuration, mongooseService: MongooseService) {
    const {url, connectionOptions, urls} = configuration.get<IMDBOptions>("mongoose") || ({} as IMDBOptions);

    const promises: Promise<Mongoose.Mongoose>[] = [];

    if (url) {
      promises.push(mongooseService.connect("default", url, connectionOptions || {}));
    }

    if (urls) {
      Object.keys(urls).forEach((key: string) => {
        promises.push(mongooseService.connect(key, urls[key].url, urls[key].connectionOptions || {}));
      });
    }

    await Promise.all(promises);

    return mongooseService;
  }
});
