import {PlatformApplication, PlatformTest} from "@tsed/common";
import {RESTDataSource} from "apollo-datasource-rest";
import {DataSource} from "../decorators/dataSource.js";
import {ApolloService} from "./ApolloService.js";

vi.mock("apollo-server-express", () => {
  return {
    ApolloServer: class {
      start = vi.fn();
      getMiddleware = vi.fn();

      constructor(public opts: any) {}
    }
  };
});
vi.mock("apollo-server-koa", () => {
  return {
    ApolloServer: class {
      start = vi.fn();
      getMiddleware = vi.fn();

      constructor(public opts: any) {}
    }
  };
});

@DataSource()
export class MyDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:8001";
  }

  willSendRequest(request: any) {
    request.headers.set("Authorization", this.context.token);
  }

  getMyData(id: string) {
    return this.get(`/rest/calendars/${id}`);
  }
}

@DataSource("myName")
export class MyDataSource2 extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:8001";
  }

  willSendRequest(request: any) {
    request.headers.set("Authorization", this.context.token);
  }

  getMyData(id: string) {
    return this.get(`/rest/calendars/${id}`);
  }
}

describe("ApolloService", () => {
  describe("when platform is express", () => {
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

          vi.spyOn(app, "use").mockReturnThis();

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

          expect(typeof (result1 as any).opts.dataSources).toEqual("function");
        });
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
      describe("when server options isn't given", () => {
        it("should create a server", async () => {
          // GIVEN
          const service = PlatformTest.get<ApolloService>(ApolloService);
          const app = PlatformTest.get(PlatformApplication);

          vi.spyOn(app, "use").mockReturnThis();

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
  describe("when platform is unknown", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "unkown"
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

          vi.spyOn(app, "use").mockReturnThis();

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
  describe("when platform is given", () => {
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

          vi.spyOn(app, "use").mockReturnThis();

          class ApolloServer {
            start = vi.fn();
            getMiddleware = vi.fn();

            constructor(opts: any) {}
          }

          // WHEN
          const result1 = await service.createServer("key", {
            path: "/path",
            server: (options: any) => new ApolloServer(options)
          } as any);

          expect(service.getSchema("key")).toEqual(undefined);
          expect(service.getSchema()).toEqual(undefined);
          expect(result1.getMiddleware).toHaveBeenCalledWith({
            path: "/path"
          });
        });
      });
    });
  });
});
