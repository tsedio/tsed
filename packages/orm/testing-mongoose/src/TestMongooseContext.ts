import {PlatformTest} from "@tsed/common";
import {MongooseService} from "@tsed/mongoose";
import {MongoMemoryReplSet, MongoMemoryServer} from "mongodb-memory-server";
import {resolve} from "path";
import {version} from "mongoose";
import semver from "semver";
import {type MongoMemoryReplSetOpts} from "mongodb-memory-server-core/lib/MongoMemoryReplSet";
import {type MongoMemoryServerOpts} from "mongodb-memory-server-core/lib/MongoMemoryServer";

const downloadDir = resolve(`${require.resolve("mongodb-memory-server")}/../../.cache/mongodb-memory-server/mongodb-binaries`);

type ReplSetCreateOpts = {
  replicaSet: true;
} & Partial<MongoMemoryReplSetOpts>;

type MemoryServerCreateOpts = {
  replicaSet?: false;
} & MongoMemoryServerOpts;

type CreateOpts = ReplSetCreateOpts | MemoryServerCreateOpts;

export class TestMongooseContext extends PlatformTest {
  static getMongo(): MongoMemoryServer | MongoMemoryReplSet {
    // @ts-ignore
    return global.__MONGOD__;
  }

  static async install({replicaSet, ...opts}: CreateOpts = {}) {
    if (!TestMongooseContext.getMongo()) {
      // @ts-ignore
      global.__MONGOD__ = await (replicaSet ? MongoMemoryReplSet : MongoMemoryServer).create({
        ...opts,
        binary: {
          ...(opts.binary || {}),
          downloadDir
        }
      });
    }

    return TestMongooseContext.getMongooseOptions();
  }

  /**
   * Connect to the in-memory database.
   */
  static bootstrap(
    mod: any,
    options: Partial<TsED.Configuration> & {
      mongod?: CreateOpts;
    } = {}
  ): () => Promise<void> {
    return async function before(): Promise<void> {
      const config = await TestMongooseContext.install(options.mongod);
      const before = PlatformTest.bootstrap(mod, {
        ...options,
        mongoose: config
      });

      await before();
    };
  }

  static async create(
    options: Partial<TsED.Configuration> & {
      mongod?: CreateOpts;
    } = {}
  ) {
    options.mongoose = await TestMongooseContext.install(options.mongod);

    return PlatformTest.create(options);
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
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

  static async getMongooseOptions(): Promise<any> {
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
