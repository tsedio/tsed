import {Controller} from "@tsed/di";
import {PlatformApplication, PlatformTest} from "@tsed/platform-http";
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {PlatformElysia} from "../src/index.js";
import {Server} from "./app/Server.js";

@Controller("/elysia-native")
class ElysiaNativeController {
  @Post("/multipart")
  multipart(@BodyParams() body: {description: string; file: File}) {
    return {
      description: body.description,
      filename: body.file.name,
      type: body.file.type
    };
  }

  @Get("/error")
  error() {
    throw new Error("elysia error");
  }
}

describe("PlatformElysia", () => {
  beforeEach(
    PlatformTest.bootstrap(Server, {
      adapter: PlatformElysia as any,
      mount: {"/rest": [ElysiaNativeController]}
    })
  );
  afterEach(PlatformTest.reset);

  it("creates a platform builder from a configuration", () => {
    expect(PlatformElysia.create({rootModule: Server})).toBeDefined();
  });

  it("maps Elysia native multipart FormData through body parameters", async () => {
    const form = new FormData();
    form.set("description", "native multipart");
    form.set("file", new File(["hello"], "hello.txt", {type: "text/plain"}));
    const app: any = PlatformTest.get(PlatformApplication).getApp();

    const response = await app.handle(new Request("http://localhost/rest/elysia-native/multipart", {method: "POST", body: form}));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      description: "native multipart",
      filename: "hello.txt",
      type: "text/plain"
    });
  });

  it("converts controller errors to an Elysia error response", async () => {
    const app: any = PlatformTest.get(PlatformApplication).getApp();

    const response = await app.handle(new Request("http://localhost/rest/elysia-native/error"));

    expect(response.status).toBe(500);
  });
});
