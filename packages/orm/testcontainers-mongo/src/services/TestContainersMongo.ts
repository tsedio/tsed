import {PlatformTest} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";
import {getMongoConnectionOptions, getMongoConnectionsOptions, startMongoServer, stopMongoServer} from "./ContainerUtils.js";

export class TestContainersMongo {
  static startMongoServer = startMongoServer;
  static stopMongoServer = stopMongoServer;
  static getMongoConnectionsOptions = getMongoConnectionsOptions;
  static getMongoConnectionOptions = getMongoConnectionOptions;

  static create(options: Partial<TsED.Configuration> = {}) {
    return PlatformTest.create({
      ...options,
      mongoose: getMongoConnectionsOptions()
    });
  }

  static bootstrap(mod: unknown, opts: Partial<TsED.Configuration> = {}) {
    return () =>
      PlatformTest.bootstrap(mod, {
        mongoose: getMongoConnectionsOptions(),
        ...opts
      })();
  }

  static async reset(collectionName?: string) {
    if (typeof collectionName === "string") {
      await TestContainersMongo.cleanCollection(collectionName);
    }

    return PlatformTest.reset();
  }

  static async cleanCollection(collectionName: string) {
    const service = PlatformTest.injector.get<MongooseService>(MongooseService)!;

    const {collections} = service.get("default")!;

    if (!collections[collectionName]) {
      console.error(`Collection ${collectionName} not found. Here available collection names: ${Object.keys(collections)}`);
      return;
    }

    await collections[collectionName].deleteMany({});
  }
}
