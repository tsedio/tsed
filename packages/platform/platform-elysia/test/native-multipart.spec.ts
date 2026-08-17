import {Configuration, Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import SuperTest from "supertest";
import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {PlatformElysia} from "../src/index.js";

@Controller("/multipart")
class MultipartController {
  @Get("/health")
  health() {
    return "ok";
  }

  @Post("/")
  upload(@BodyParams("name") name: string, @BodyParams("file") file: any) {
    return {
      contentType: file.type,
      name,
      filename: file.name,
      size: file.size
    };
  }
}

@Configuration({
  logger: {
    level: "off"
  },
  mount: {
    "/rest": [MultipartController]
  }
})
class Server {}

describe("PlatformElysia native multipart", () => {
  let request: SuperTest.Agent;

  beforeAll(PlatformTest.bootstrap(Server, {adapter: PlatformElysia as any}));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("exposes Elysia's native Fetch handler", async () => {
    const response = await PlatformTest.fetch(new Request("http://localhost/rest/multipart/health"));

    expect(await response.text()).toEqual("ok");
  });

  it("parses FormData files without Multer", async () => {
    const response = await request
      .post("/rest/multipart")
      .field("name", "Ada")
      .attach("file", Buffer.from("hello"), {contentType: "text/plain", filename: "hello.txt"})
      .expect(200);

    expect(response.body).toEqual({
      contentType: "text/plain",
      filename: "hello.txt",
      name: "Ada",
      size: 5
    });
  });
});
