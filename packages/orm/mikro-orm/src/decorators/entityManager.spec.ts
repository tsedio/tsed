import {MikroORM} from "@mikro-orm/core";
import {MongoEntityManager} from "@mikro-orm/mongodb";
import {DITest, Injectable} from "@tsed/di";
import {afterEach, beforeEach} from "vitest";

import {MikroOrmRegistry} from "../services/MikroOrmRegistry.js";
import {Em, EntityManager, entityManager} from "./entityManager.js";

describe("@EntityManager()", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("decorator", () => {
    it("should decorate property (without context)", async () => {
      @Injectable()
      class UsersService {
        @Em()
        public readonly em!: MongoEntityManager;
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({em: {id: "id"}} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);
      expect(ormRegistry.get).toHaveBeenCalledWith(undefined);
      expect(usersService.em).toEqual({id: "id"});
    });
    it("should decorate property (with context)", async () => {
      @Injectable()
      class UsersService {
        @EntityManager("context")
        public readonly orm!: MikroORM;
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({em: {id: "id"}} as never)
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
        public readonly em = entityManager();
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({em: {id: "id"}} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);
      expect(ormRegistry.get).toHaveBeenCalledWith(undefined);
      expect(usersService.em).toEqual({id: "id"});
    });
    it("should inject property (with context)", async () => {
      @Injectable()
      class UsersService {
        public readonly em = entityManager("context");
      }

      const ormRegistry = {
        get: vi.fn().mockReturnValue({em: {id: "id"}} as never)
      };

      const usersService = await DITest.invoke<UsersService>(UsersService, [
        {
          token: MikroOrmRegistry,
          use: ormRegistry
        }
      ]);

      expect(ormRegistry.get).toHaveBeenCalledWith("context");
      expect(usersService.em).toEqual({id: "id"});
    });
  });
});
