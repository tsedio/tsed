import {Service} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Connection, ConnectionOptions, createConnection} from "typeorm";

@Service()
export class TypeORMService {
  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  private _instances: Map<string, Connection> = new Map();

  /**
   *
   * @returns {Promise<"mongoose".Connection>}
   */
  async createConnection(id: string, settings: ConnectionOptions): Promise<any> {
    const key = settings.name || id;

    if (key && this.has(key)) {
      return await this.get(key)!;
    }

    $log.info(`Create connection with typeorm to database: ${key}`);
    $log.debug(`options: ${JSON.stringify(settings)}`);

    try {
      const connection = await createConnection(settings!);
      $log.info(`Connected with typeorm to database: ${key}`);
      this._instances.set(key || "default", connection);

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
   * @returns {"mongoose".Connection}
   */
  get(id: string = "default"): Connection | undefined {
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
}
