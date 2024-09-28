import {MikroORM, Options} from "@mikro-orm/core";
import {Logger} from "@tsed/logger";
import {anything, instance, mock, reset, verify, when} from "ts-mockito";

import {MikroOrmFactory} from "./MikroOrmFactory.js";
import {MikroOrmRegistry} from "./MikroOrmRegistry.js";

const fixtures: {mydb2: Options; none: Options; mydb: Options} = {
  mydb: {
    contextName: "mydb",
    type: "postgresql",
    clientUrl: "postgresql://localhost:5432"
  },
  none: {
    type: "postgresql",
    clientUrl: "postgresql://localhost:5432"
  },
  mydb2: {
    contextName: "mydb2",
    type: "postgresql",
    clientUrl: "postgresql://localhost:5432"
  }
} as never;

describe("MikroOrmRegistry", () => {
  const loggerMock = mock<Logger>();
  const mikroOrmFactoryMock = mock<MikroOrmFactory>();
  const mikroOrm = mock(MikroORM);

  Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));

  let mikroOrmRegistry!: MikroOrmRegistry;

  beforeEach(() => {
    mikroOrmRegistry = new MikroOrmRegistry(instance(loggerMock), instance(mikroOrmFactoryMock));
  });

  afterEach(() => reset<MikroORM | MikroOrmFactory>(mikroOrmFactoryMock, mikroOrm));

  describe("register", () => {
    it("should register instances", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));

      // act
      const result1 = await mikroOrmRegistry.register(fixtures.mydb);
      const result2 = await mikroOrmRegistry.register(fixtures.mydb);
      const result3 = await mikroOrmRegistry.register(fixtures.none);
      const result4 = await mikroOrmRegistry.register(fixtures.mydb2);

      // assert
      expect(result1).toEqual(mikroOrmRegistry.get("mydb"));
      expect(result2).toEqual(mikroOrmRegistry.get("mydb"));
      expect(result3).toEqual(mikroOrmRegistry.get("default"));
      expect(result4).toEqual(mikroOrmRegistry.get("mydb2"));
      verify(mikroOrmFactoryMock.create(anything())).thrice();
    });
  });

  describe("clear", () => {
    it("should dispose all instances", async () => {
      // arrange
      when(mikroOrm.isConnected()).thenResolve(true);
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      await mikroOrmRegistry.register(fixtures.none);
      await mikroOrmRegistry.register(fixtures.mydb2);

      // act
      await mikroOrmRegistry.clear();

      // assert
      verify(mikroOrm.close(anything())).twice();
    });
  });

  describe("get", () => {
    it("should return corresponded instances", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      const none = await mikroOrmRegistry.register(fixtures.none);
      const mydb = await mikroOrmRegistry.register(fixtures.mydb);

      // act
      const result1 = mikroOrmRegistry.get();
      const result2 = mikroOrmRegistry.get("default");
      const result3 = mikroOrmRegistry.get("mydb");

      // assert
      expect(result1).toEqual(none);
      expect(result2).toEqual(none);
      expect(result3).toEqual(mydb);
    });
  });

  describe("has", () => {
    it("should return corresponded instances existence", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      await mikroOrmRegistry.register(fixtures.none);
      await mikroOrmRegistry.register(fixtures.mydb);

      // act & assert
      expect(mikroOrmRegistry.has()).toBeTruthy();
      expect(mikroOrmRegistry.has("mydb")).toBeTruthy();
      expect(mikroOrmRegistry.has("default")).toBeTruthy();
      expect(mikroOrmRegistry.has("mydb10")).toBeFalsy();
    });
  });

  describe("values", () => {
    it("should return corresponded instances", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      await mikroOrmRegistry.register(fixtures.none);
      await mikroOrmRegistry.register(fixtures.mydb);

      // act & assert
      expect([...mikroOrmRegistry.values()]).toMatchObject([instance(mikroOrm), instance(mikroOrm)]);
    });
  });
});
