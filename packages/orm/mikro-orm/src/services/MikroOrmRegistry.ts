import {MikroOrmFactory} from "./MikroOrmFactory";
import {Inject, Injectable} from "@tsed/di";
import {IDatabaseDriver as DatabaseDriver, MikroORM, Options} from "@mikro-orm/core";
import {catchAsyncError, getValue} from "@tsed/core";
import {Logger} from "@tsed/logger";

@Injectable()
export class MikroOrmRegistry {
  private readonly instances = new Map<string, MikroORM>();

  constructor(@Inject() private readonly logger: Logger, @Inject() private readonly mikroOrmFactory: MikroOrmFactory) {}

  public async register<T extends DatabaseDriver>(options: Options<T>): Promise<MikroORM> {
    const contextName = getValue<string>(options, "contextName", "default");

    if (this.has(contextName)) {
      return this.get(contextName)!;
    }

    this.logger.info(`Create connection with MikroOrm to database: %s`, contextName);
    this.logger.debug(`options: %j`, options);

    const instance = await this.mikroOrmFactory.create(options);

    this.instances.set(contextName, instance);

    this.logger.info(`Connected with MikroOrm to database: %s`, contextName);

    return instance;
  }

  public get(contextName: string = "default"): MikroORM | undefined {
    return this.instances.get(contextName);
  }

  public has(contextName: string = "default"): boolean {
    return this.instances.has(contextName);
  }

  public async clear(): Promise<void> {
    const instances = [...this.instances.values()];

    await Promise.all(instances.map((instance: MikroORM) => catchAsyncError(() => this.dispose(instance))));

    this.instances.clear();
  }

  /**
   * @deprecated Since 2022-02-01. Use {@link clear} instead
   */
  public closeConnections(): Promise<void> {
    return this.clear();
  }

  private async dispose(instance: MikroORM): Promise<void> {
    if (await instance.isConnected()) {
      await instance.close(false);
    }
  }
}
