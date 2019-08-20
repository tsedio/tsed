import {Service} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Connection, ConnectionManager, ConnectionOptions, getConnectionManager} from "typeorm";

@Service()
export class TypeORMService {
  /**
   *
   * @type {Map<any, any>}
   * @deprecated
   */
  readonly instances: Map<string, Connection> = new Map();

  /**
   *
   * @type {"typeorm".ConnectionManager}
   * @private
   */
  readonly connectionManager: ConnectionManager = getConnectionManager();

  /**
   *
   * @returns {Promise<"typeorm".Connection>}
   */
  async createConnection(id: string = "default", settings: ConnectionOptions): Promise<any> {
    const key = settings.name || id;

    if (key && this.has(key)) {
      return await this.get(key)!;
    }

    $log.info(`Create connection with typeorm to database: ${key}`);
    $log.debug(`options: ${JSON.stringify(settings)}`);

    try {
      const connection = this.connectionManager.create(settings!);
      await connection.connect();
      $log.info(`Connected with typeorm to database: ${key}`);
      this.instances.set(key, connection);

      return connection;
    } catch (err) {
      /* istanbul ignore next */
      $log.error(err);
      /* istanbul ignore next */
      process.exit();
    }
  }

  /**
   *
   * @returns {"typeorm".Connection}
   */
  get(id: string = "default"): Connection | undefined {
    return this.connectionManager.get(id);
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this.connectionManager.has(id);
  }

  closeConnections(): Promise<any> {
    const promises = this.connectionManager.connections.map(instance => instance.close());

    return Promise.all(promises);
  }
}
