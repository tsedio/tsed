import {Inject, InjectorService, Service} from "@tsed/di";
import {Connection, ConnectionManager, ConnectionOptions, getConnectionManager} from "typeorm";
import {createConnection} from "../utils/createConnection";

@Service()
export class TypeORMService {
  readonly connectionManager: ConnectionManager = getConnectionManager();

  @Inject(InjectorService)
  private injector: InjectorService;

  async createConnection(connectionOptions: ConnectionOptions): Promise<any> {
    const connection = await createConnection(connectionOptions);
    this.injector.logger.info(`Connected with typeorm to database: ${connection.name}`);

    return connection;
  }

  get(id: string = "default"): Connection {
    return this.connectionManager.get(id);
  }

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
