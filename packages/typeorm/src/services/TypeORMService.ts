import {Service} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Connection, ConnectionOptions, getConnectionManager} from "typeorm";

@Service()
export class TypeORMService {
  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  readonly instances: Map<string, Connection> = new Map();

  /**
   *
   * @returns {Promise<"typeorm".Connection>}
   */
  async createConnection(id: string = "default", settings: ConnectionOptions): Promise<any> {
    const key = settings.name || id;

    const connectionManager = getConnectionManager();

    if (key && connectionManager.has(key)) {
      return await connectionManager.get(key)!;
    }

    $log.info(`Create connection with typeorm to database: ${key}`);
    $log.debug(`options: ${JSON.stringify(settings)}`);

    try {
      const connection = connectionManager.create(settings!);
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

  closeConnections(): Promise<any> {
    const promises = Array.from(this.instances.values()).map(instance => instance.close());

    return Promise.all(promises);
  }
}
