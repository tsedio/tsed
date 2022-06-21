import {PlatformTest} from "@tsed/common";
import {MikroOrmContextMiddleware} from "./MikroOrmContextMiddleware";
import {deepEqual, instance, mock, reset, verify, when} from "ts-mockito";
import {MikroOrmEntityManagers} from "../services/MikroOrmEntityManagers";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry";
import {EntityManager, MikroORM} from "@mikro-orm/core";

describe("MikroOrmContextMiddleware", () => {
  const mockedManagers = mock<MikroOrmEntityManagers>();
  const mockedMikroOrmRegistry = mock<MikroOrmRegistry>();
  const mockedMikroORM = mock<MikroORM>();

  beforeEach(() =>
    PlatformTest.create({
      imports: [
        {
          token: MikroOrmRegistry,
          use: instance(mockedMikroOrmRegistry)
        },
        {
          token: MikroOrmEntityManagers,
          use: instance(mockedManagers)
        }
      ]
    })
  );

  afterEach(() => {
    reset<MikroOrmEntityManagers | MikroOrmRegistry | MikroORM>(mockedManagers, mockedMikroOrmRegistry, mockedMikroORM);

    return PlatformTest.reset();
  });

  it("should create context", async () => {
    // arrange
    const expected = {name: "context1"} as unknown as EntityManager;
    const middleware = PlatformTest.get<MikroOrmContextMiddleware>(MikroOrmContextMiddleware);
    const ctx = PlatformTest.createRequestContext();

    when(mockedMikroOrmRegistry.values()).thenReturn([instance(mockedMikroORM)] as unknown as IterableIterator<MikroORM>);
    when(mockedMikroORM.em).thenReturn(expected);

    // act
    await middleware.use(ctx);

    // assert
    verify(mockedManagers.set(deepEqual([expected]))).once();
  });
});
