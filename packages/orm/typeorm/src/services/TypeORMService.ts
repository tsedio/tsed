import {Inject, InjectorService, Service} from "@tsed/di";
import {getValue} from "@tsed/core";
import {Connection, ConnectionManager, ConnectionOptions, getConnectionManager} from "typeorm";
import {createConnection} from "../utils/createConnection";

@Service()
export class TypeORMService {
  /**
   *
   * @type {"typeorm".ConnectionManager}
   * @private
   */
  readonly connectionManager: ConnectionManager = getConnectionManager();

  @Inject(InjectorService)
  private injector: InjectorService;

  /**
   *
   * @returns {Promise<"typeorm".Connection>}
   */
  async createConnection(connectionOptions: ConnectionOptions): Promise<any> {
    const name = getValue<string>(connectionOptions, "name", "default");

    if (this.has(name)) {
      return this.get(name);
    }

    this.injector.logger.info(`Create connection with typeorm to database: ${name}`);
    this.injector.logger.debug(`options: ${JSON.stringify(connectionOptions)}`);

    try {
      const connection = await createConnection({...connectionOptions, name});

      this.injector.logger.info(`Connected with typeorm to database: ${name}`);

      return connection;
    } catch (err) {
      /* istanbul ignore next */
      console.error(err);
      /* istanbul ignore next */
      process.exit();
    }
  }

  /**
   *
   * @returns {"typeorm".Connection}
   */
  get(id: string = "default"): Connection {
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
    const promises = this.connectionManager.connections.map((instance) => {
      if (instance.isConnected) {
        return instance.close();
      }
    });

    return Promise.all(promises);
  }
}
