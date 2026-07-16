import {DITest, Injectable} from "@tsed/di";
import {Orm, orm} from "./orm.js";
import {afterEach, beforeEach} from "vitest";
import {MikroORM} from "@mikro-orm/core";
import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";

describe("@Orm()", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("decorator", () => {
    it("should decorate property (without context)", async () => {
      @Injectable()
      class UsersService {
        @Orm()
        public readonly orm!: MikroORM;
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({id: "id"} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);
      expect(ormRegistry.get).toHaveBeenCalledWith(undefined);
      expect(usersService.orm).toEqual({id: "id"});
    });
    it("should decorate property (with context)", async () => {
      @Injectable()
      class UsersService {
        @Orm("context")
        public readonly orm!: MikroORM;
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({id: "id"} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);

      expect(ormRegistry.get).toHaveBeenCalledWith("context");
      expect(usersService.orm).toEqual({id: "id"});
    });
  });

  describe("prop function", () => {
    it("should inject property (without context)", async () => {
      @Injectable()
      class UsersService {
        public readonly orm = orm();
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({id: "id"} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);
      expect(ormRegistry.get).toHaveBeenCalledWith(undefined);
      expect(usersService.orm).toEqual({id: "id"});
    });
    it("should inject property (with context)", async () => {
      @Injectable()
      class UsersService {
        public readonly orm = orm("context");
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({id: "id"} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);

      expect(ormRegistry.get).toHaveBeenCalledWith("context");
      expect(usersService.orm).toEqual({id: "id"});
    });
  });
});
