import {Injectable} from "@tsed/di";
import {PlatformServerlessTest} from "@tsed/platform-serverless-testing";
import {MinLength, Post, Property} from "@tsed/schema";

import {BodyParams, PlatformServerless} from "../src/index.js";

class Model {
  @Property()
  id: string;

  @MinLength(3)
  name: string;
}

@Injectable()
class BodyLambda {
  @Post("/scenario-1/:id")
  scenario1(@BodyParams("id") id: string) {
    return {
      statusText: "message",
      status: 216,
      headers: {
        "test-x": "id"
      },
      data: {
        test: "hello"
      }
    };
  }
}

describe("Response", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [BodyLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Post lambda with body and handle response", () => {
    it("should return data", async () => {
      const response = await PlatformServerlessTest.request.call("scenario1").post("/").body({
        id: "1",
        name: "Test"
      });

      expect(response.statusCode).toBe(216);
      expect(JSON.parse(response.body)).toEqual({test: "hello"});
      expect(response.headers).toEqual({
        "test-x": "id",
        "x-request-id": "requestId",
        "content-type": "application/json"
      });
    });
  });
});
