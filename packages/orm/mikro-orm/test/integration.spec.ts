import {PlatformTest} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {User} from "./helpers/entity/User";
import {Server} from "./helpers/Server";
import {UserService} from "./helpers/services/UserService";
import {EntityManager, MikroORM} from "@mikro-orm/core";
import {anyOfClass, anything, reset, spy, verify} from "ts-mockito";
import {UnmanagedEventSubscriber1} from "./helpers/services/UnmanagedEventSubscriber1";
import {UnmanagedEventSubscriber2} from "./helpers/services/UnmanagedEventSubscriber2";
import {MikroOrmModule, TransactionalInterceptor} from "../src";
import {Hooks} from "./helpers/services/Hooks";

describe("MikroOrm integration", () => {
  let spiedLogger!: Logger;
  let spiedTransactionalInterceptor!: TransactionalInterceptor;
  let spiedHooks!: Hooks;

  beforeEach(async () => {
    await TestMongooseContext.install();
    const {url: clientUrl} = await TestMongooseContext.getMongooseOptions();
    const bstrp = PlatformTest.bootstrap(Server, {
      disableComponentScan: true,
      imports: [MikroOrmModule],
      mikroOrm: [
        {
          clientUrl,
          type: "mongo",
          entities: [User],
          // @ts-expect-error mikro-orm supports the class reference starting from v6
          subscribers: [UnmanagedEventSubscriber1, new UnmanagedEventSubscriber2()]
        },
        {
          clientUrl,
          contextName: "db1",
          type: "mongo",
          entities: [User]
        },
        {
          clientUrl,
          contextName: "db2",
          type: "mongo",
          entities: [User]
        }
      ]
    });

    await bstrp();

    spiedLogger = spy(PlatformTest.get(Logger));
    spiedTransactionalInterceptor = spy(PlatformTest.get(TransactionalInterceptor));
    spiedHooks = spy(PlatformTest.get(Hooks));
  });

  afterEach(async () => {
    reset<Hooks | TransactionalInterceptor | Logger>(spiedLogger, spiedTransactionalInterceptor, spiedHooks);

    await TestMongooseContext.reset();
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
