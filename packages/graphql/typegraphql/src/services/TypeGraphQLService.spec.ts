import {ApolloService} from "@tsed/apollo";
import {PlatformTest} from "@tsed/common";
import {AuthResolver, RecipeResolver} from "../../test/app/graphql/index.js";
import {TypeGraphQLService} from "./TypeGraphQLService.js";

async function createApolloServiceFixture() {
  const server = {
    server: "server"
  };

  const map = new Map();

  const apolloService = {
    createServer: vi.fn((key: string, options: any) => {
      map.set(key, {
        instance: server,
        options
      });
      return Promise.resolve(server);
    }),
    get: (key: string) => map.get(key)?.instance,
    getSchema: (key: string) => "schema",
    has: (key: string) => map.has(key)
  };

  const service = await PlatformTest.invoke<TypeGraphQLService>(TypeGraphQLService, [
    {
      token: ApolloService,
      use: apolloService
    }
  ]);

  return {apolloService, server, service};
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
        const {service, apolloService} = await createApolloServiceFixture();

        vi.spyOn(service as any, "createSchema").mockReturnValue({schema: "schema"});

        const result1 = await service.createServer("key", {
          path: "/path",
          resolvers: [AuthResolver]
        } as any);
        const result2 = await service.createServer("key", {path: "/path", resolvers: [AuthResolver]} as any);

        expect(apolloService.createServer).toHaveBeenCalledWith("typegraphql-key", {
          dataSources: expect.any(Function),
          path: "/path",
          resolvers: [AuthResolver, RecipeResolver],
          schema: {schema: "schema"}
        });

        expect(result2).toEqual(result1);
        expect(result1).toEqual({server: "server"});
        expect(service.getSchema("key")).toEqual("schema");
        expect(service.createSchema).toHaveBeenCalledWith({
          resolvers: [AuthResolver, RecipeResolver],
          container: PlatformTest.injector,
          globalMiddlewares: expect.any(Array)
        });
      });
    });
  });
});
