import {Service} from "@tsed/common";
import * as Mongoose from "mongoose";
import {$log} from "ts-log-debug";

@Service()
export class MongooseService {
  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  private _instances: Map<string, Mongoose.Mongoose> = new Map();

  /**
   *
   * @returns {Promise<"mongoose".Connection>}
   */
  async connect(id: string, url: string, connectionOptions: Mongoose.ConnectionOptions): Promise<any> {
    if (this.has(id)) {
      return await this.get(id)!;
    }

    $log.info(`Connect to mongo database: ${id}`);
    $log.debug(`Url: ${url}`);
    $log.debug(`options: ${JSON.stringify(connectionOptions)}`);

    try {
      const mongoose = await Mongoose.connect(url, connectionOptions);
      this._instances.set(id, mongoose);

      return mongoose;
    } catch (er) {
      /* istanbul ignore next */
      $log.error(er);
      /* istanbul ignore next */
      process.exit();
    }
  }

  /**
   *
   * @returns {"mongoose".Connection}
   */
  get(id: string = "default"): Mongoose.Mongoose | undefined {
    return this._instances.get(id);
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this._instances.has(id);
  }

  async closeConnections() {
    for (const instance of this._instances.values()) {
      /**
       * Connection ready state
       * 0 = disconnected
       * 1 = connected
       * 2 = connecting
       * 3 = disconnecting
       */
      if (
        instance != null &&
        instance.connection != null &&
        (instance.connection.readyState === 1 || instance.connection.readyState === 2)
      ) {
        await instance.disconnect();
      }
    }
  }
}
