import {RESTDataSource} from "@apollo/datasource-rest";
import {ApolloServer, ApolloServerPlugin} from "@apollo/server";
import {catchAsyncError} from "@tsed/core";
import {Configuration, Constant, InjectContext, Module, runInContext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {PlatformApplication, PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {HTTPDataSource} from "apollo-datasource-http";

import {APOLLO_CONTEXT} from "../constants/constants.js";
import {DataSource} from "../decorators/dataSource.js";
import {InjectApolloContext} from "../decorators/injectApolloContext.js";
import type {AlterApolloContext} from "../interfaces/AlterApolloContext.js";
import type {AlterApolloServerPlugins} from "../interfaces/AlterApolloServerPlugins.js";
import type {ApolloContext} from "../interfaces/ApolloContext.js";
import type {ApolloSettings} from "../interfaces/ApolloSettings.js";
import {ApolloService} from "./ApolloService.js";

vi.mock("@apollo/server/express4", () => {
  return {
    __esModule: true,
    expressMiddleware: vi.fn().mockReturnValue("expressMiddleware")
  };
});
vi.mock("@as-integrations/koa", () => {
  return {
    __esModule: true,
    koaMiddleware: vi.fn().mockReturnValue("koaMiddleware")
  };
});

export interface CustomApolloContext extends ApolloContext {
  token: string | undefined;
}

@Module()
class MyModule implements AlterApolloContext, AlterApolloServerPlugins {
  $alterApolloServerPlugins(
    plugins: ApolloServerPlugin[],
    serverSettings: ApolloSettings
  ): ApolloServerPlugin[] | Promise<ApolloServerPlugin[]> {
    return plugins.concat("extraPlugin" as never);
  }

  $alterApolloContext(context: ApolloContext, $ctx: PlatformContext): CustomApolloContext | Promise<CustomApolloContext> {
    const header = $ctx.request.get("authorization");

    return {
      ...context,
      token: header
    } as CustomApolloContext;
  }
}

@DataSource()
export class MyDataSource extends RESTDataSource {
  @InjectContext()
  $ctx: PlatformContext;

  @Constant("envs.MY_BACK_URL", "http://localhost:8001")
  declare baseURL: string;

  @InjectApolloContext()
  protected context: CustomApolloContext;

  constructor(server: ApolloServer, logger: Logger) {
    super({
      logger,
      cache: server.cache
    });
  }

  willSendRequest(path: string, request: any) {
    request.headers["authorization"] = this.context.token;
  }

  getMyData(id: string) {
    return this.get(`/rest/calendars/${id}`);
  }
}

@DataSource("myName")
export class MyDataSource2 extends RESTDataSource {
  @InjectContext()
  $ctx: PlatformContext;

  constructor() {
    super();
    this.baseURL = "http://localhost:8001";
  }

  getMyData(id: string) {
    return this.get(`/rest/calendars/${id}`);
  }
}

@DataSource()
class MoviesAPI extends HTTPDataSource {
  constructor(
    @InjectApolloContext() {token}: CustomApolloContext,
    server: ApolloServer,
    logger: Logger,
    @Configuration() configuration: Configuration
  ) {
    // the necessary arguments for HTTPDataSource
    super(configuration.get("envs.MOVIES_API_URL"), {
      logger
    });

    // We need to call the initialize method in our data source's
    // constructor, passing in our cache and contextValue.
    this.initialize({cache: server.cache, context: token});
  }

  getMovie(id: string) {
    return this.get(`movies/${encodeURIComponent(id)}`);
  }
}

function getFixture() {
  const service = PlatformTest.get<ApolloService>(ApolloService);
  const logger = PlatformTest.get<Logger>(Logger);
  const app = PlatformTest.get(PlatformApplication);

  const serverMockInstance = {
    start: vi.fn()
  };
  const serverMock = vi.fn().mockReturnValue(serverMockInstance);

  vi.spyOn(app, "use").mockReturnThis();

  return {
    service,
    logger,
    app,
    serverMock,
    serverMockInstance
  };
}

describe("ApolloService", () => {
  describe("when platform is express", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "express",
        envs: {
          MOVIES_API_URL: "http://localhost:8001"
        }
      })
    );
    afterEach(() => {
      return PlatformTest.reset();
    });

    describe("createServer()", () => {
      it("should create a server", async () => {
        // GIVEN
        const {serverMock, service, app} = getFixture();

        const opts = {
          path: "/path",
          server: serverMock,
          schema: "schema",
          typeDefs: "typeDefs",
          resolvers: "resolvers"
        } as never;

        // WHEN
        const result1 = await service.createServer("key", opts);
        const result2 = await service.createServer("key", opts);

        expect(service.getSchema("key")).toEqual("schema");
        expect(service.getSchema()).toEqual(undefined);
        expect(service.getResolvers("key")).toEqual("resolvers");
        expect(service.getResolvers()).toEqual(undefined);
        expect(service.getTypeDefs("key")).toEqual("typeDefs");
        expect(service.getTypeDefs()).toEqual(undefined);
        expect(service.has("key")).toEqual(true);
        expect(service.has()).toEqual(false);
        expect(result2).toEqual(result1);
        expect(app.use).toHaveBeenCalledWith("/path", "expressMiddleware");
        expect(serverMock).toHaveBeenCalledWith({
          plugins: expect.any(Array),
          schema: "schema",
          typeDefs: "typeDefs",
          resolvers: "resolvers"
        });
        expect(serverMock.mock.calls[0][0].plugins).toContain("extraPlugin");
      });
      it("should log server error", async () => {
        // GIVEN
        const {serverMock, logger, serverMockInstance, service, app} = getFixture();

        const opts = {
          path: "/path",
          server: serverMock
        } as never;

        vi.spyOn(logger, "error");

        serverMockInstance.start.mockRejectedValue(new Error("test"));

        // WHEN
        const result = await catchAsyncError(() => service.createServer("key", opts));

        expect(result).toEqual(new Error("test"));
        expect(logger.error).toHaveBeenCalledWith({
          error_name: "Error",
          event: "APOLLO_BOOTSTRAP_ERROR",
          message: "test",
          stack: expect.any(String)
        });
      });
    });

    describe("createContextHandler()", () => {
      it("should create a context handler", async () => {
        // GIVEN
        const {service, serverMock} = getFixture();
        const $ctx = PlatformTest.createRequestContext();

        const opts = {
          path: "/path",
          server: serverMock
        } as never;

        // WHEN
        const server = await service.createServer("key", opts);

        // WHEN
        const result = service.createContextHandler(server, {
          dataSources: () => ({
            myDataSource: MyDataSource
          })
        } as never);

        $ctx.request.headers["authorization"] = "token";

        const contextResult: CustomApolloContext = await runInContext($ctx, () => result());

        expect(contextResult.token).toEqual("token");
        expect(Object.keys(contextResult.dataSources)).toEqual(["myDataSource", "myName", "moviesAPI"]);

        expect($ctx.get(APOLLO_CONTEXT)).toEqual(contextResult);
      });
    });
  });
  describe("when platform is koa", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "koa"
      })
    );
    afterEach(() => {
      return PlatformTest.reset();
    });

    describe("createServer()", () => {
      it("should create a server", async () => {
        // GIVEN
        const {serverMock, app, service} = getFixture();

        // WHEN
        const opts = {
          path: "/path",
          server: serverMock
        } as never;

        const result1 = await service.createServer("key", opts);
        const result2 = await service.createServer("key", {path: "/path"} as any);

        expect(service.getSchema("key")).toEqual(undefined);
        expect(service.getSchema()).toEqual(undefined);
        expect(result2).toEqual(result1);
        expect(app.use).toHaveBeenCalledWith("/path", "koaMiddleware");
        expect(serverMock).toHaveBeenCalledWith({
          plugins: expect.any(Array)
        });
      });
    });
  });
  describe("when platform is unknown", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "unknown"
      })
    );
    afterEach(() => {
      return PlatformTest.reset();
    });

    describe("createServer()", () => {
      it("should not create a server", async () => {
        // GIVEN
        const {serverMock, logger, service} = getFixture();

        vi.spyOn(logger, "warn");
        // WHEN
        const opts = {
          path: "/path",
          server: serverMock
        } as never;

        // WHEN
        const result1 = await service.createServer("key", opts);
        const result2 = await service.createServer("key", opts);

        expect(service.getSchema("key")).toEqual(undefined);
        expect(service.getSchema("key")).toEqual(undefined);
        expect(service.getSchema()).toEqual(undefined);
        expect(result2).toEqual(result1);
        expect(logger.warn).toHaveBeenCalledWith({
          event: "APOLLO_UNKNOWN_PLATFORM",
          message: "Platform not supported. Please use Ts.ED platform (express, koa)"
        });
      });
    });
  });
});
