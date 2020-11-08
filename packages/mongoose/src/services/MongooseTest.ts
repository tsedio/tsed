import {getValue} from "@tsed/core";
import {DITest} from "@tsed/di";
import {MongoMemoryServer} from "mongodb-memory-server";
import {resolve} from "path";
import {MDBConnection} from "../interfaces/MDBConnection";
import {MongooseService} from "./MongooseService";

function getDatabasesSettings(settings: Partial<TsED.Configuration>): MDBConnection[] {
  const databases = getValue<any[]>(settings, "mongoose", getValue(settings, "databases", [{id: "default"}]));
  return ([] as any[]).concat(databases);
}

export class MongooseTest extends DITest {
  static getDownloadDir() {
    return resolve(`${require.resolve("mongodb-memory-server")}/../../.cache/mongodb-memory-server/mongodb-binaries`);
  }

  static getMongo(): MongoMemoryServer {
    // @ts-ignore
    return global.__MONGOD__;
  }

  static async install(settings: any = {}): Promise<MDBConnection[]> {
    if (!MongooseTest.getMongo()) {
      // @ts-ignore
      global.__MONGOD__ = new MongoMemoryServer({
        ...getValue(settings, "mongod", {}),
        binary: {
          ...getValue(settings, "mongod.binary", {}),
          downloadDir: this.getDownloadDir()
        }
      });
    }

    const mongod = MongooseTest.getMongo();

    // istanbul ignore next
    if (!mongod.runningInstance) {
      await mongod.start();
    }

    const mongooseOptions = await MongooseTest.getMongooseOptions();
    const databases = getDatabasesSettings(settings);

    return await Promise.all(
      databases.map(async (item) => {
        return {
          ...item,
          ...mongooseOptions,
          connectionOptions: {
            ...getValue(item, "connectionOptions", {}),
            ...getValue(mongooseOptions, "connectionOptions", {})
          }
        };
      })
    );
  }

  /**
   * Connect to the in-memory database.
   */
  static bootstrap(mod: any, settings: Partial<TsED.Configuration> = {}): () => Promise<void> {
    return async function before(): Promise<void> {
      const {PlatformTest} = await import("@tsed/common");
      const mongooseSettings = await MongooseTest.install(settings);

      const before = PlatformTest.bootstrap(mod, {
        ...settings,
        mongoose: mongooseSettings
      });

      await before();
    };
  }

  static async create(settings: Partial<TsED.Configuration> = {}) {
    const mongooseSettings = await MongooseTest.install(settings);

    return DITest.create({
      ...settings,
      mongoose: mongooseSettings
    });
  }

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static async reset() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await DITest.reset();
    await MongooseTest.getMongo().stop();
  }

  /**
   *
   */
  static async clearDatabase() {
    const mongooseService = DITest.get<MongooseService>(MongooseService);
    const promises: any[] = [];

    for (const connection of mongooseService.connections.values()) {
      promises.push(...Object.values(connection.collections).map((collection) => collection.deleteMany({})));
    }

    await Promise.all(promises);
  }

  static async getMongooseOptions() {
    const url = await MongooseTest.getMongo().getUri();

    return {
      url,
      connectionOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }
    };
  }
}
