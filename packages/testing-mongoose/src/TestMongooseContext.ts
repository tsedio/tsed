import {PlatformTest} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {MongoMemoryServer} from "mongodb-memory-server";
import * as Mongoose from "mongoose";
import {resolve} from "path";

const downloadDir = resolve(`${require.resolve("mongodb-memory-server")}/../../.cache/mongodb-memory-server/mongodb-binaries`);

export class TestMongooseContext extends TestContext {
  private static mongod: MongoMemoryServer;

  static async install(options: any = {binary: {}}) {
    if (!this.mongod) {
      this.mongod = new MongoMemoryServer({
        ...options,
        binary: {
          ...(options.binary || {}),
          downloadDir
        }
      });
    }

    return TestMongooseContext.getMongooseOptions();
  }

  /**
   * Connect to the in-memory database.
   */
  static bootstrap(mod: any, options: Partial<TsED.Configuration> = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      const config = await TestMongooseContext.install(options.mongod);

      if (mod.isServerLoader) {
        const before = TestContext.bootstrap(mod, {
          ...options,
          mongoose: config
        });

        await before();
      } else {
        const before = PlatformTest.bootstrap(mod, {
          ...options,
          mongoose: config
        });

        await before();
      }
    };
  }

  static async create(options: Partial<TsED.Configuration> = {}) {
    options.mongoose = await TestMongooseContext.install(options.mongod);

    return TestContext.create(options);
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    await TestContext.reset();
    await TestMongooseContext.mongod.stop();
    delete TestMongooseContext.mongod;
  }

  /**
   *
   */
  static async clearDatabase() {
    const collections = Mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  static async getMongooseOptions() {
    const url = await TestMongooseContext.mongod.getConnectionString();

    return {
      url,
      connectionOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
      }
    };
  }
}
