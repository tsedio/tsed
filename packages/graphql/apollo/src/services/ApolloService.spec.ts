import {PlatformTest} from "@tsed/common";
import {ApolloServer} from "apollo-server-express";
import {ApolloService} from "./ApolloService";
import {jest} from "@jest/globals";

jest.mock("apollo-server-express");

describe("ApolloService", () => {
  beforeEach(() =>
    PlatformTest.create({
      PLATFORM_NAME: "express"
    })
  );
  afterEach(() => {
    return PlatformTest.reset();
  });

  describe("createServer()", () => {
    describe("when server options isn't given", () => {
      it("should create a server", async () => {
        // GIVEN
        const service = PlatformTest.get(ApolloService);

        // WHEN
        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);

        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(service.getSchema("key")).toEqual(undefined);
        expect(service.getSchema()).toEqual(undefined);
        expect(result2).toEqual(result1);
        expect(result1).toBeInstanceOf(ApolloServer);
        expect(result1.getMiddleware).toHaveBeenCalledWith({
          path: "/path"
        });
      });
    });
  });
});
