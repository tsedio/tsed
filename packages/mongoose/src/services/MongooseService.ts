import {$log, Service} from "@tsed/common";
import * as Mongoose from "mongoose";

@Service()
export class MongooseService {
  readonly connections: Map<string, Mongoose.Connection> = new Map();
  private defaultConnection: string = "default";

  /**
   *
   * @returns {Promise<"mongoose".Connection>}
   */
  async connect(id: string, url: string, connectionOptions: Mongoose.ConnectionOptions, isDefault = false): Promise<any> {
    if (this.has(id)) {
      return await this.get(id)!;
    }

    $log.info(`Connect to mongo database: ${id}`);
    $log.debug(`Url: ${url}`);
    $log.debug(`options: ${JSON.stringify(connectionOptions)}`);

    try {
      const connection = await Mongoose.createConnection(url, connectionOptions);
      this.connections.set(id, connection);

      if (id === "default" || isDefault) {
        this.defaultConnection = id;
      }

      return connection;
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
  get(id?: string): Mongoose.Connection | undefined {
    return this.connections.get(id || this.defaultConnection);
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id?: string): boolean {
    return this.connections.has(id || this.defaultConnection);
  }

  async closeConnections() {
    for (const [id, connection] of this.connections.entries()) {
      await connection.close();
      this.connections.delete(id);
    }
  }
}
