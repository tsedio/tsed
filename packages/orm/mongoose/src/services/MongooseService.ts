import {Inject, Injectable} from "@tsed/di";
import {Logger} from "@tsed/logger";
import Mongoose from "mongoose";
import {ConnectOptions} from "mongoose";

// istanbul ignore next
function asPromise(c: any) {
  return c && c.asPromise ? c.asPromise() : c;
}

@Injectable()
export class MongooseService {
  readonly connections: Map<string, Mongoose.Connection> = new Map();
  private defaultConnection: string = "default";

  @Inject()
  logger: Logger;

  /**
   *
   * @returns {Promise<"mongoose".Connection>}
   */
  async connect(id: string, url: string, connectionOptions: ConnectOptions, isDefault = false): Promise<any> {
    if (this.has(id)) {
      return await this.get(id)!;
    }

    this.logger.info(`Connect to mongo database: ${id}`);
    this.logger.debug(`Url: ${url}`);
    this.logger.debug(`options: ${JSON.stringify(connectionOptions)}`);

    try {
      const connection = await asPromise(Mongoose.createConnection(url, connectionOptions));
      this.connections.set(id, connection);

      if (id === "default" || isDefault) {
        this.defaultConnection = id;
      }

      return connection;
    } catch (er) {
      /* istanbul ignore next */
      this.logger.error({
        event: "MONGO_CONNECTION_ERROR",
        error_name: er.name,
        message: er.message,
        stack: er.stack
      });
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
