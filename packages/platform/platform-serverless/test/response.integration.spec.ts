import {Injectable} from "@tsed/di";
import {BodyParams, Patch, Post, Put, PlatformServerlessTest} from "@tsed/platform-serverless";
import {MinLength, Property, Returns} from "@tsed/schema";
import {expect} from "chai";

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
    PlatformServerlessTest.bootstrap({
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

      expect(response.statusCode).to.equal(216);
      expect(JSON.parse(response.body)).to.deep.equal({ test: 'hello' });
      expect(response.headers).to.deep.equal({ 'test-x': 'id' });
    });
  });
});
