import {jest} from "@jest/globals";
import {PlatformApplication, PlatformTest} from "@tsed/common";
import {ApolloServer} from "apollo-server-express";
import {ApolloService} from "./ApolloService";

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
        const service = PlatformTest.get<ApolloService>(ApolloService);
        const app = PlatformTest.get(PlatformApplication);

        jest.spyOn(app, "use").mockReturnThis();

        // WHEN
        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);

        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(service.getSchema("key")).toEqual(undefined);
        expect(service.getSchema()).toEqual(undefined);
        expect(result2).toEqual(result1);
        expect(result1.getMiddleware).toHaveBeenCalledWith({
          path: "/path"
        });
      });
    });
  });
});
