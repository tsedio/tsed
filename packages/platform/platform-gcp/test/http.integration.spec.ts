import {Controller, Injectable} from "@tsed/di";
import {BodyParams, PathParams, QueryParams} from "@tsed/platform-params";
import {Get, Post, Returns} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {PlatformGCP} from "../src/builder/PlatformGCP.js";
import {GCPFunction} from "../src/exports.js";
import {createFakeHttpEvent} from "../src/utils/createGCPContext.js";

@Injectable()
class HttpService {
  get() {
    return {value: "test"};
  }
}

@Controller("/api")
class HttpController {
  constructor(private service: HttpService) {}

  @Get("/:id")
  @GCPFunction()
  @Returns(200, Object)
  getById(@PathParams("id") id: string) {
    return {
      id,
      ...this.service.get()
    };
  }

  @Get("/")
  @GCPFunction()
  @Returns(200, Object)
  getAll(@QueryParams("filter") filter?: string) {
    return {
      items: [
        {id: "1", name: "Item 1"},
        {id: "2", name: "Item 2"}
      ],
      filter,
      ...this.service.get()
    };
  }

  @Post("/")
  @GCPFunction()
  @Returns(201, Object)
  create(@BodyParams() body: any) {
    return {
      id: "new-id",
      ...body,
      created: true
    };
  }
}

describe("HTTP Integration", () => {
  let platform: PlatformGCP;
  let httpEvent: ReturnType<typeof createFakeHttpEvent>;

  beforeEach(() => {
    platform = PlatformGCP.bootstrap({
      gcpFunctions: [HttpController]
    });
    httpEvent = createFakeHttpEvent();
  });

  afterEach(async () => {
    await platform.stop();
  });

  describe("GET /:id", () => {
    it("should return item by id", async () => {
      // Create a handler for the getById method
      const handler = PlatformGCP.callback(HttpController, "getById");

      // Set up the HTTP event
      httpEvent.req.method = "GET";
      httpEvent.req.path = "/api/123";
      httpEvent.req.params = {id: "123"};

      // Call the handler
      await handler(httpEvent);

      // Verify the response
      expect(httpEvent.res.status).toHaveBeenCalledWith(200);
      expect(httpEvent.res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "123",
          value: "test"
        })
      );
    });
  });

  describe("GET /", () => {
    it("should return all items", async () => {
      // Create a handler for the getAll method
      const handler = PlatformGCP.callback(HttpController, "getAll");

      // Set up the HTTP event
      httpEvent.req.method = "GET";
      httpEvent.req.path = "/api";
      httpEvent.req.query = {filter: "active"};

      // Call the handler
      await handler(httpEvent);

      // Verify the response
      expect(httpEvent.res.status).toHaveBeenCalledWith(200);
      expect(httpEvent.res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            {id: "1", name: "Item 1"},
            {id: "2", name: "Item 2"}
          ],
          filter: "active",
          value: "test"
        })
      );
    });
  });

  describe("POST /", () => {
    it("should create a new item", async () => {
      // Create a handler for the create method
      const handler = PlatformGCP.callback(HttpController, "create");

      // Set up the HTTP event
      httpEvent.req.method = "POST";
      httpEvent.req.path = "/api";
      httpEvent.req.body = {name: "New Item"};

      // Call the handler
      await handler(httpEvent);

      // Verify the response
      expect(httpEvent.res.status).toHaveBeenCalledWith(201);
      expect(httpEvent.res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "new-id",
          name: "New Item",
          created: true
        })
      );
    });
  });
});
