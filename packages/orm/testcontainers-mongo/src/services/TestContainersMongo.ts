import {PlatformTest} from "@tsed/platform-http/testing";
import {MongoClient} from "mongodb";

import {getMongoConnectionOptions, getMongoConnectionsOptions, startMongoServer, stopMongoServer} from "./ContainerUtils.js";

export class TestContainersMongo {
  static startMongoServer = startMongoServer;
  static stopMongoServer = stopMongoServer;
  static getMongoConnectionsOptions = getMongoConnectionsOptions;
  static getMongoConnectionOptions = getMongoConnectionOptions;

  private static configuration: ReturnType<typeof getMongoConnectionsOptions>;

  static create(options: Partial<TsED.Configuration> = {}) {
    TestContainersMongo.configuration = getMongoConnectionsOptions();

    return PlatformTest.create({
      ...options,
      mongoose: TestContainersMongo.configuration
    });
  }

  static bootstrap(mod: unknown, opts: Partial<TsED.Configuration> = {}) {
    return () => {
      TestContainersMongo.configuration = getMongoConnectionsOptions();
      return PlatformTest.bootstrap(mod, {
        mongoose: TestContainersMongo.configuration,
        ...opts
      })();
    };
  }

  static async reset(collectionName?: string) {
    if (typeof collectionName === "string") {
      await TestContainersMongo.cleanCollection(collectionName);
    }

    return PlatformTest.reset();
  }

  static async cleanCollection(collectionName: string, mongoSettings = TestContainersMongo.configuration) {
    try {
      const client = new MongoClient(mongoSettings[0].url, {
        directConnection: true
      });

      await client.connect();
      const db = client.db();
      await db.collection(collectionName).deleteMany({});
      await client.close();
    } catch (er) {
      console.error(`Collection ${collectionName} not found. ${er.message} ${er.stack}`);
    }
  }
}
