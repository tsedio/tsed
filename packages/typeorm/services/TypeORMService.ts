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
    if (this.has(id)) {
      return await this.get(id)!;
    }

    $log.info(`Connect to typeorm database: ${id}`);
    $log.debug(`options: ${JSON.stringify(settings)}`);

    return (
      createConnection(settings)
        .then((connection: Connection) => {
          this._instances.set(id, connection);
        })
        /* istanbul ignore next */
        .catch(err => {
          /* istanbul ignore next */
          $log.error(err);
          /* istanbul ignore next */
          process.exit();
        })
    );
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
