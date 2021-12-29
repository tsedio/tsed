import {MikroOrmRegistry} from "./MikroOrmRegistry";
import {MikroOrmFactory} from "./MikroOrmFactory";
import {anything, instance, mock, reset, verify, when} from "ts-mockito";
import {Logger} from "@tsed/logger";
import {MikroORM, Options} from "@mikro-orm/core";

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
};

describe("MikroOrmRegistry", () => {
  const loggerMock = mock<Logger>();
  const mikroOrmFactoryMock = mock<MikroOrmFactory>();
  const mikroOrm = mock(MikroORM);

  Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));

  const mikroOrmRegistry = new MikroOrmRegistry(instance(loggerMock), instance(mikroOrmFactoryMock));

  beforeEach(() => reset<MikroORM | MikroOrmFactory>(mikroOrmFactoryMock, mikroOrm));

  describe("createConnection", () => {
    it("should create connections", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));

      // act
      const result1 = await mikroOrmRegistry.createConnection(fixtures.mydb);
      const result2 = await mikroOrmRegistry.createConnection(fixtures.mydb);
      const result3 = await mikroOrmRegistry.createConnection(fixtures.none);
      const result4 = await mikroOrmRegistry.createConnection(fixtures.mydb2);

      // assert
      expect(result1).toEqual(mikroOrmRegistry.get("mydb"));
      expect(result2).toEqual(mikroOrmRegistry.get("mydb"));
      expect(result3).toEqual(mikroOrmRegistry.get("default"));
      expect(result4).toEqual(mikroOrmRegistry.get("mydb2"));
      verify(mikroOrmFactoryMock.create(anything())).thrice();
    });

    it("should close all connections", async () => {
      // arrange
      when(mikroOrm.isConnected()).thenResolve(true);

      // act
      await mikroOrmRegistry.closeConnections();

      // assert
      verify(mikroOrm.close(anything())).thrice();
    });
  });

  describe("get", () => {
    it("should return corresponded connections", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      const defaultConnection = await mikroOrmRegistry.createConnection(fixtures.none);
      const customConnection = await mikroOrmRegistry.createConnection(fixtures.mydb);

      // act
      const result1 = mikroOrmRegistry.get();
      const result2 = mikroOrmRegistry.get("default");
      const result3 = mikroOrmRegistry.get("mydb");

      // assert
      expect(result1).toEqual(defaultConnection);
      expect(result2).toEqual(defaultConnection);
      expect(result3).toEqual(customConnection);
    });
  });

  describe("has", () => {
    it("should return corresponded connections existence", async () => {
      // arrange
      Object.values(fixtures).forEach((options: Options) => when(mikroOrmFactoryMock.create(options)).thenResolve(instance(mikroOrm)));
      await mikroOrmRegistry.createConnection(fixtures.none);
      await mikroOrmRegistry.createConnection(fixtures.mydb);

      // act & assert
      expect(mikroOrmRegistry.has()).toBeTruthy();
      expect(mikroOrmRegistry.has("mydb")).toBeTruthy();
      expect(mikroOrmRegistry.has("default")).toBeTruthy();
      expect(mikroOrmRegistry.has("mydb10")).toBeFalsy();
    });
  });
});
