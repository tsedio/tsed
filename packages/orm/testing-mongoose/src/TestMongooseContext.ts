import {PlatformTest} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
import {resolve} from "path";
import {version} from "mongoose";
import semver from "semver";
import {MongoMemoryServerStates} from "mongodb-memory-server-core/lib/MongoMemoryServer";

const downloadDir = resolve(`${require.resolve("mongodb-memory-server")}/../../.cache/mongodb-memory-server/mongodb-binaries`);

export class TestMongooseContext extends PlatformTest {
  static getMongo(): MongoMemoryServer {
    // @ts-ignore
    return global.__MONGOD__;
  }

  static async install(options: any = {binary: {}}) {
    if (!TestMongooseContext.getMongo()) {
      // @ts-ignore
      global.__MONGOD__ = new MongoMemoryServer({
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
      const before = PlatformTest.bootstrap(mod, {
        ...options,
        mongoose: config
      });

      await before();
    };
  }

  static async create(options: Partial<TsED.Configuration> = {}) {
    options.mongoose = await TestMongooseContext.install(options.mongod);

    return PlatformTest.create(options);
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await PlatformTest.reset();
    await TestMongooseContext.getMongo().stop();
  }

  /**
   *
   */
  static async clearDatabase() {
    const mongooseService = PlatformTest.get<MongooseService>(MongooseService);
    const promises: any[] = [];

    for (const connection of mongooseService.connections.values()) {
      promises.push(...Object.values(connection.collections).map((collection) => collection.deleteMany({})));
    }

    await Promise.all(promises);
  }

  static async getMongooseOptions() {
    const mongo = TestMongooseContext.getMongo();
    try {
      !["running", "starting"].includes(mongo.state) && (await mongo.start());
    } catch (er) {}

    const url = mongo.getUri();

    return {
      url,
      connectionOptions: semver.lt(version, "6.0.0")
        ? {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
          }
        : {}
    };
  }
}
