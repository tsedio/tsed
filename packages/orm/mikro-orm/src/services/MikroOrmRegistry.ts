import {MikroOrmFactory} from "./MikroOrmFactory";
import {Inject, Injectable, InjectorService} from "@tsed/di";
import {IDatabaseDriver as DatabaseDriver, MikroORM, Options} from "@mikro-orm/core";
import {catchAsyncError, getValue} from "@tsed/core";

@Injectable()
export class MikroOrmRegistry {
  private readonly connections = new Map<string, MikroORM>();

  constructor(@Inject() private readonly injector: InjectorService, @Inject() private readonly mikroOrmFactory: MikroOrmFactory) {}

  public async createConnection<T extends DatabaseDriver>(connectionOptions: Options<T>): Promise<MikroORM> {
    const connectionName = getValue<string>(connectionOptions, "contextName", "default");

    if (this.has(connectionName)) {
      return this.get(connectionName);
    }

    this.injector.logger.info(`Create connection with MikroOrm to database: %s`, connectionName);
    this.injector.logger.debug(`options: %j`, connectionOptions);

    const connection = await this.mikroOrmFactory.create(connectionOptions);

    this.connections.set(connectionName, connection);

    this.injector.logger.info(`Connected with MikroOrm to database: %s`, connectionName);

    return connection;
  }

  public get(id: string = "default"): MikroORM {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.connections.get(id)!;
  }

  public has(id: string = "default"): boolean {
    return this.connections.has(id);
  }

  public async closeConnections(): Promise<void> {
    const connections = [...this.connections.values()];

    await Promise.all(connections.map((connection: MikroORM) => catchAsyncError(() => this.dispose(connection))));

    this.connections.clear();
  }

  private async dispose(connection: MikroORM): Promise<void> {
    if (await connection.isConnected()) {
      await connection.close(false);
    }
  }
}
