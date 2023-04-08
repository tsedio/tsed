import {PlatformTest} from "@tsed/common";
import {Logger} from "@tsed/logger";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {User} from "./helpers/entity/User";
import {Server} from "./helpers/Server";
import {EventSubscriber1} from "./helpers/services/EventSubscriber1";
import {UserService} from "./helpers/services/UserService";
import {MikroORM} from "@mikro-orm/core";
import {anything, spy, verify} from "ts-mockito";
import {EventSubscriber2} from "./helpers/services/EventSubscriber2";
import "./helpers/services/EventSubscriber3";
import {MikroOrmModule, TransactionalInterceptor} from "../src";

describe("MikroOrm integration", () => {
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
          subscribers: [EventSubscriber1, new EventSubscriber2()]
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
  });
  afterEach(TestMongooseContext.reset);

  it("should return repository", () => {
    const service = PlatformTest.injector.get<UserService>(UserService)!;

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
    const service = PlatformTest.injector.get<UserService>(UserService)!;
    const transactionalInterceptor = PlatformTest.injector.get<TransactionalInterceptor>(TransactionalInterceptor)!;
    const spiedTransactionalInterceptor = spy(transactionalInterceptor);

    await service.create({email: "test@example.com"});

    verify(spiedTransactionalInterceptor.intercept(anything(), anything())).once();
  });

  it("should resolve the configured subscribers", async () => {
    const service = PlatformTest.injector.get<UserService>(UserService)!;
    const logger = PlatformTest.injector.get<Logger>(Logger)!;
    const spiedLogger = spy(logger);

    await service.create({email: "test@example.com"});

    verify(spiedLogger.info("Changes has been flushed.")).thrice();
  });
});
