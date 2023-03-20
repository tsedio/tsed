import {ApolloService} from "@tsed/apollo";
import {PlatformTest} from "@tsed/common";
import {AuthResolver, RecipeResolver} from "../../test/app/graphql/index";
import {TypeGraphQLService} from "./TypeGraphQLService";

const noop = () => {};

function createApolloServiceFixture() {
  const server = {
    server: "server"
  };

  const map = new Map();

  const apolloService = {
    createServer: async (key: string, options: any) => {
      map.set(key, {
        instance: server,
        options
      });

      return server;
    },
    get: (key: string) => map.get(key).instance,
    getSchema: (key: string) => "schema",
    has: (key: string) => map.has(key)
  };
  return {apolloService, server};
}

describe("TypeGraphQLService", () => {
  beforeEach(() =>
    PlatformTest.create({
      PLATFORM_NAME: "express"
    })
  );
  afterEach(() => {
    PlatformTest.reset();
  });

  describe("createServer()", () => {
    describe("when server options isn't given", () => {
      it("should create a server", async () => {
        const {apolloService} = createApolloServiceFixture();

        const service = await PlatformTest.invoke<TypeGraphQLService>(TypeGraphQLService, [
          {
            token: ApolloService,
            use: apolloService
          }
        ]);

        jest.spyOn(service as any, "createSchema").mockReturnValue({schema: "schema"});

        jest.spyOn(service as any, "createDataSources").mockReturnValue(noop);

        const result1 = await service.createServer("key", {
          path: "/path"
        } as any);
        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(result2).toEqual(result1);
        expect(result1.server).toEqual("server");
        expect(service.getSchema("key")).toEqual("schema");
        expect(service.createSchema).toHaveBeenCalledWith({
          resolvers: [AuthResolver, RecipeResolver],
          container: PlatformTest.injector
        });
      });
    });
  });
  describe("createDataSources", () => {
    it("should return a function with all dataSources", () => {
      const dataSources = jest.fn().mockReturnValue({
        api: "api"
      });
      const serverConfigSources = jest.fn().mockReturnValue({
        api2: "api2"
      });

      const service = PlatformTest.get<TypeGraphQLService>(TypeGraphQLService);

      // @ts-ignore
      const fn = service.createDataSources(dataSources, serverConfigSources);
      const result = fn();

      expect(result).toEqual({
        api2: "api2",
        api: "api",
        myDataSource: result.myDataSource
      });
    });
    it("should do nothing", () => {
      const service = PlatformTest.get<TypeGraphQLService>(TypeGraphQLService);

      // @ts-ignore
      const fn = service.createDataSources();
      const result = fn();

      expect(result).toEqual({
        myDataSource: result.myDataSource
      });
    });
  });
});
