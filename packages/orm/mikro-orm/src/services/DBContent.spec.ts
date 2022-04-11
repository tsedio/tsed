import {DBContext} from "@tsed/mikro-orm";
import {EntityManager} from "@mikro-orm/core";

describe("DBContext", () => {
  describe("run", () => {
    it("should return result of execution of callback", async () => {
      // arrange
      const dbCtx = new DBContext();
      const store = new Map<string, EntityManager>();
      const expected = 1;
      const callback = jest.fn().mockResolvedValue(expected);

      // act
      const result = await dbCtx.run(store, callback);

      // assert
      expect(callback).toBeCalled();
      expect(result).toEqual(expected);
    });
  });

  describe("get", () => {
    it("should return undefined if not such context", () => {
      // arrange
      const ctx = new DBContext();

      // act
      const result = ctx.get("unknown");

      // assert
      expect(result).toBeUndefined();
    });

    it("should return context if it is initialized", async () => {
      // arrange
      const dbCtx = new DBContext();
      const expected = {} as unknown as EntityManager;
      const store = new Map<string, EntityManager>([["context1", expected]]);
      const callback = jest.fn().mockImplementation(() => {
        const result = dbCtx.get("context1");

        // assert
        expect(result).toEqual(expected);
      });

      // act
      await dbCtx.run(store, callback);

      // assert
      expect(callback).toBeCalled();
    });
  });

  describe("has", () => {
    it("should return false if not such context", () => {
      // arrange
      const ctx = new DBContext();

      // act
      const result = ctx.has("unknown");

      // assert
      expect(result).toBeFalsy();
    });

    it("should return context if it is initialized", async () => {
      // arrange
      const dbCtx = new DBContext();
      const expected = {} as unknown as EntityManager;
      const store = new Map<string, EntityManager>([["context1", expected]]);
      const callback = jest.fn().mockImplementation(() => {
        const result = dbCtx.has("context1");

        // assert
        expect(result).toBeTruthy();
      });

      // act
      await dbCtx.run(store, callback);

      // assert
      expect(callback).toBeCalled();
    });
  });

  describe("getContext", () => {
    it("should return undefined if store is not initialized yet", () => {
      // arrange
      const dbCtx = new DBContext();

      // act
      const result = dbCtx.entries();

      // assert
      expect(result).toBeUndefined();
    });

    it("should return story if it is initialized by calling `DBContext.run`", async () => {
      // arrange
      const dbCtx = new DBContext();
      const store = new Map<string, EntityManager>();
      const callback = jest.fn().mockImplementation(() => {
        const result = dbCtx.entries();

        // assert
        expect(result).toEqual(store);
      });

      // act
      await dbCtx.run(store, callback);

      // assert
      expect(callback).toBeCalled();
    });
  });
});
