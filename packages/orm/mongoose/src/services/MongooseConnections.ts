import {Configuration, registerProvider} from "@tsed/di";
import {isArray} from "@tsed/core";
import {MongooseConnectionOptions} from "../interfaces/MongooseConnectionOptions";
import {MongooseService} from "../services/MongooseService";

/**
 * @ignore
 */
// tslint:disable-next-line:variable-name
export const MONGOOSE_CONNECTIONS = Symbol.for("MONGOOSE_CONNECTIONS");
/**
 * @ignore
 */
export type MONGOOSE_CONNECTIONS = MongooseService;

function mapOptions(options: Omit<MongooseConnectionOptions, "id"> | MongooseConnectionOptions[]): MongooseConnectionOptions[] {
  if (!options) {
    return [];
  }

  if (!isArray(options)) {
    const {url, connectionOptions} = options || {};

    return [
      {
        id: "default",
        url,
        connectionOptions
      }
    ];
  }

  return (options as MongooseConnectionOptions[]).map((settings) => {
    return {
      ...settings,
      connectionOptions: settings.connectionOptions
    };
  });
}

registerProvider({
  provide: MONGOOSE_CONNECTIONS,
  injectable: false,
  deps: [Configuration, MongooseService],
  async useAsyncFactory(configuration: Configuration, mongooseService: MongooseService) {
    const settings = mapOptions(configuration.get<MongooseConnectionOptions | MongooseConnectionOptions[]>("mongoose"));
    let isDefault = true;

    for (const current of settings) {
      await mongooseService.connect(
        current.id,
        current.url,
        current.connectionOptions || {
          useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        isDefault
      );

      isDefault = false;
    }

    return mongooseService;
  }
});
