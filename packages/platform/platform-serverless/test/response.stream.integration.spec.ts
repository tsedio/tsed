import {Readable} from "node:stream";

import {Injectable} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {Post, Returns} from "@tsed/schema";

import {PlatformServerless} from "../src/index.js";

@Injectable()
class StreamLambda {
  @Post("/scenario-1/:id")
  @(Returns(200, String).Binary())
  scenario1(@BodyParams("id") id: string) {
    return Readable.from(
      Buffer.from(
        JSON.stringify({
          id: "HELLO"
        })
      )
    );
  }
}

describe("Stream", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [StreamLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Post lambda with body and handle response", () => {
    it("should return data", async () => {
      const response = await PlatformServerlessTest.request.call("scenario1").post("/").body({
        id: "1",
        name: "Test"
      });

      expect(response).toEqual({
        body: '{"id":"HELLO"}',
        headers: {
          "content-type": "application/octet-stream",
          "x-request-id": "requestId"
        },
        statusCode: 200
      });
    });
  });
});
