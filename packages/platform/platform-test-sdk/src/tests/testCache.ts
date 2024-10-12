import {Controller, Inject} from "@tsed/di";
import {PlatformCache, UseCache} from "@tsed/platform-cache";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PathParams, QueryParams} from "@tsed/platform-params";
import {Get, Head, Post, Property} from "@tsed/schema";
import SuperTest from "supertest";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

let increment = 0;

export function testCache(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;

  class MyModel {
    @Property()
    name: string;
  }

  class MyService {
    @UseCache({
      key: "key"
    })
    get(id: string) {
      return {id: `one:${id}`};
    }

    @UseCache({
      key(args: any[]) {
        return `key:${args[0]}`;
      }
    })
    get2(id: string) {
      return {id: `one:${id}`};
    }
  }

  @Controller("/caches")
  class TestCacheController {
    @Inject()
    myService: MyService;

    @Get("/scenario-1")
    @UseCache()
    scenario1() {
      increment++;
      return "hello world " + increment;
    }

    @Get("/scenario-2")
    @UseCache({ttl: 400})
    scenario2() {
      return {info: "hello child"};
    }

    @Head("/scenario-3")
    @UseCache()
    scenario3() {
      return undefined;
    }

    @Post("/scenario-4")
    @UseCache()
    scenario4() {
      return {info: "hello child"};
    }

    @Get("/scenario-5/:id")
    @UseCache({ttl: 400})
    scenario5(@PathParams("id") id: string, @QueryParams() model: MyModel) {
      return {info: "hello child", id, ...model};
    }

    @Get("/scenario-6/:id")
    scenario6(@PathParams("id") id: string) {
      return this.myService.get(id);
    }

    @Get("/scenario-7/:id")
    scenario7(@PathParams("id") id: string) {
      return this.myService.get2(id);
    }
  }

  describe("withCache", () => {
    beforeEach(
      PlatformTest.bootstrap(options.server, {
        ...options,
        logger: {},
        mount: {
          "/rest": [TestCacheController]
        },
        cache: {
          ttl: 300,
          store: "memory"
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    describe("scenario 1: GET /rest/caches/scenario-1", () => {
      it("should return data with cached response", async () => {
        const response = await request.get("/rest/caches/scenario-1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-1").expect(200);

        expect(response.text).toContain("hello world");
        expect(response.headers["cache-control"]).toMatch(/max-age=300/);
        expect(response.headers["x-cached"]).toBeUndefined();

        expect(response2.text).toContain("hello world");
        expect(response2.headers["cache-control"]).toMatch(/max-age=300/);
        expect(response2.headers["x-cached"]).toEqual("true");
        expect(response2.headers["etag"]).toEqual(response.headers["etag"]);
      });

      it("should return 304 when content isn't modified", async () => {
        const platformCache = PlatformTest.get<PlatformCache>(PlatformCache);

        const response = await request.get("/rest/caches/scenario-1").expect(200);

        if (response.headers["etag"]) {
          // platform koa doesn't support Etag
          await request
            .get("/rest/caches/scenario-1")
            .set("if-none-match", response.headers["etag"] || "")
            .expect(304);

          await platformCache.reset();

          await request
            .get("/rest/caches/scenario-1")
            .set("if-none-match", response.headers["etag"] || "")
            .expect(200);
        }
      });

      it("should return fresh data if cache-control is set to no-cache", async () => {
        await request.get("/rest/caches/scenario-1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-1").set("cache-control", "no-cache").expect(200);

        expect(response2.text).toContain("hello world");
        expect(response2.headers["cache-control"]).toMatch(/max-age=300/);
        expect(response2.headers["x-cached"]).toBeUndefined();
        expect(response2.headers["etag"]).toEqual(response2.headers["etag"]);
      });
    });
    describe("scenario 2: GET /rest/caches/scenario-2", () => {
      it("should return data with cached response", async () => {
        const response = await request.get("/rest/caches/scenario-2").expect(200);
        const response2 = await request.get("/rest/caches/scenario-2").expect(200);

        expect(response.body).toEqual({info: "hello child"});
        expect(response.headers["cache-control"]).toMatch(/max-age=400/);
        expect(response.headers["x-cached"]).toBeUndefined();

        expect(response2.body).toEqual({info: "hello child"});
        expect(response2.headers["cache-control"]).toMatch(/max-age=400/);
        expect(response2.headers["x-cached"]).toEqual("true");
        expect(response2.headers["etag"]).toEqual(response.headers["etag"]);
      });
    });
    describe("scenario 4: POST /rest/caches/scenario-4", () => {
      it("should not cache POST method", async () => {
        const response = await request.post("/rest/caches/scenario-4").expect(200);
        const response2 = await request.post("/rest/caches/scenario-4").expect(200);

        expect(response.body).toEqual({
          info: "hello child"
        });
        expect(response.headers["cache-control"]).toBeUndefined();
        expect(response.headers["x-cached"]).toBeUndefined();

        expect(response2.body).toEqual({
          info: "hello child"
        });
        expect(response.headers["cache-control"]).toBeUndefined();
        expect(response2.headers["x-cached"]).toBeUndefined();
        expect(response2.headers["etag"]).toEqual(response.headers["etag"]);
      });
    });
    describe("scenario 5: GET /rest/caches/scenario-5", () => {
      it("should return data with then cache response", async () => {
        const response = await request.get("/rest/caches/scenario-5/1?name=1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-5/1?name=1").expect(200);
        const response3 = await request.get("/rest/caches/scenario-5/2?name=2").expect(200);
        const response4 = await request.get("/rest/caches/scenario-5/2?name=2").expect(200);
        const response5 = await request.get("/rest/caches/scenario-5/2?name=3").expect(200);

        expect(response.body).toEqual({
          id: "1",
          info: "hello child",
          name: "1"
        });
        expect(response2.body).toEqual({
          id: "1",
          info: "hello child",
          name: "1"
        });
        expect(response.headers["x-cached"]).toBeUndefined();
        expect(response2.headers["x-cached"]).toEqual("true");
        expect(response.body).toEqual(response2.body);

        expect(response3.body).toEqual({
          id: "2",
          info: "hello child",
          name: "2"
        });
        expect(response4.body).toEqual({
          id: "2",
          info: "hello child",
          name: "2"
        });
        expect(response3.headers["x-cached"]).toBeUndefined();
        expect(response4.headers["x-cached"]).toEqual("true");
        expect(response3.body).toEqual(response4.body);

        expect(response2.body).not.toEqual(response4);
        expect(response5.body).not.toEqual(response4);
      });
    });
    describe("scenario 6: GET /rest/caches/scenario-6", () => {
      it("should return data from cached service", async () => {
        const response = await request.get("/rest/caches/scenario-6/1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-6/2").expect(200);

        expect(response.body).toEqual({id: "one:1"});
        expect(response2.body).toEqual({id: "one:1"});
        expect(response.headers["x-cached"]).toBeUndefined();
        expect(response2.headers["x-cached"]).toBeUndefined();
        expect(response.body).toEqual(response2.body);
      });
    });
    describe("scenario 7: GET /rest/caches/scenario-7", () => {
      it("should return data from cached service", async () => {
        const response = await request.get("/rest/caches/scenario-7/1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-7/2").expect(200);
        const response3 = await request.get("/rest/caches/scenario-7/2").expect(200);

        expect(response.body).toEqual({id: "one:1"});
        expect(response2.body).toEqual({
          id: "one:2"
        });
        expect(response3.body).toEqual({
          id: "one:2"
        });
        expect(response.body).not.toEqual(response2.body);
      });
    });
  });
  describe("withoutCache", () => {
    beforeEach(
      PlatformTest.bootstrap(options.server, {
        ...options,
        logger: {},
        cache: false,
        mount: {
          "/rest": [TestCacheController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    describe("scenario 1: GET /rest/caches/scenario-1", () => {
      it("should return data with cached response", async () => {
        const response = await request.get("/rest/caches/scenario-1").expect(200);
        const response2 = await request.get("/rest/caches/scenario-1").expect(200);

        expect(response.text).toContain("hello world");
        expect(response.headers["x-cached"]).toBeUndefined();

        expect(response2.text).toContain("hello world");
        expect(response2.headers["x-cached"]).toBeUndefined();
      });
    });
  });
}
