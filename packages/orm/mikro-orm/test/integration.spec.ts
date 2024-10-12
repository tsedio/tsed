import {EntityManager, MikroORM} from "@mikro-orm/core";
import {defineConfig} from "@mikro-orm/mongodb";
import {Logger} from "@tsed/logger";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {anyOfClass, anything, reset, spy, verify} from "ts-mockito";

import {MikroOrmModule, TransactionalInterceptor} from "../src/index.js";
import {User} from "./helpers/entity/User.js";
import {Server} from "./helpers/Server.js";
import {Hooks} from "./helpers/services/Hooks.js";
import {UnmanagedEventSubscriber1} from "./helpers/services/UnmanagedEventSubscriber1.js";
import {UnmanagedEventSubscriber2} from "./helpers/services/UnmanagedEventSubscriber2.js";
import {UserService} from "./helpers/services/UserService.js";

describe("MikroOrm integration", () => {
  let spiedLogger!: Logger;
  let spiedTransactionalInterceptor!: TransactionalInterceptor;
  let spiedHooks!: Hooks;

  beforeEach(async () => {
    const mongoSettings = TestContainersMongo.getMongoConnectionOptions();
    const bstrp = PlatformTest.bootstrap(Server, {
      disableComponentScan: true,
      imports: [MikroOrmModule],
      mikroOrm: [
        defineConfig({
          clientUrl: mongoSettings.url,
          entities: [User],
          subscribers: [UnmanagedEventSubscriber1, new UnmanagedEventSubscriber2()],
          driverOptions: mongoSettings.connectionOptions
        }),
        defineConfig({
          clientUrl: mongoSettings.url,
          contextName: "db1",
          entities: [User],
          driverOptions: mongoSettings.connectionOptions
        }),
        defineConfig({
          clientUrl: mongoSettings.url,
          contextName: "db2",
          entities: [User],
          driverOptions: mongoSettings.connectionOptions
        })
      ]
    });

    await bstrp();

    spiedLogger = spy(PlatformTest.get(Logger));
    spiedTransactionalInterceptor = spy(PlatformTest.get(TransactionalInterceptor));
    spiedHooks = spy(PlatformTest.get(Hooks));
  });

  afterEach(async () => {
    reset<Hooks | TransactionalInterceptor | Logger>(spiedLogger, spiedTransactionalInterceptor, spiedHooks);

    await TestContainersMongo.reset();
  });

  it("should return repository", () => {
    const service = PlatformTest.get<UserService>(UserService)!;

    expect(service).toBeInstanceOf(UserService);
    expect(service.orm).toBeInstanceOf(MikroORM);
    expect(service.orm.em.name).toBe("default");
    expect(service.em.name).toBe("default");

    expect(service.orm1).toBeInstanceOf(MikroORM);
    expect(service.orm1.em.name).toBe("db1");
    expect(service.em1.name).toBe("db1");

    expect(service.orm2).toBeInstanceOf(MikroORM);
    expect(service.orm2.em.name).toBe("db2");
    expect(service.em2.name).toBe("db2");

    expect(service.em3).toEqual(undefined);
  });

  it("should create a request context", async () => {
    const service = PlatformTest.get<UserService>(UserService)!;

    await service.create({email: "test@example.com"});

    verify(spiedTransactionalInterceptor.intercept(anything(), anything())).once();
  });

  it("should resolve the configured subscribers", async () => {
    const service = PlatformTest.get<UserService>(UserService)!;

    await service.create({email: "test@example.com"});

    verify(spiedLogger.info("Changes has been flushed.")).thrice();
  });

  it("should emit the $afterTransactionCommit event", async () => {
    const service = PlatformTest.get<UserService>(UserService)!;

    await service.create({email: "test@example.com"});

    verify(spiedHooks.$afterTransactionCommit(anyOfClass(EntityManager))).calledAfter(
      spiedHooks.$beforeTransactionCommit(anyOfClass(EntityManager))
    );
  });
});
