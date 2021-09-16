import {Injectable} from "@tsed/di";
import {Delete, Get, PathParams, PlatformServerlessTest} from "@tsed/platform-serverless";
import {Returns} from "@tsed/schema";
import {expect} from "chai";

@Injectable()
class PathParamLambda {
  @Get("/scenario-1/:id")
  scenario1(@PathParams("id") id: string) {
    return {
      id
    };
  }

  @Delete("/scenario-2/:id")
  @Returns(204)
  scenario2(@PathParams("id") id: string) {
    return;
  }
}

describe("Path params", () => {
  beforeEach(
    PlatformServerlessTest.bootstrap({
      lambda: [PathParamLambda]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  describe("scenario1: Get lambda with params", () => {
    it("should map data with param", async () => {
      const response = await PlatformServerlessTest.request.call("scenario1").params({
        id: "1"
      });

      expect(response.statusCode).to.equal(200);
      expect(JSON.parse(response.body)).to.deep.equal({
        id: "1"
      });
    });
  });

  describe("scenario2: Should delete resource with 204", () => {
    it("should return the expected data", async () => {
      const response = await PlatformServerlessTest.request.call("scenario2").delete("/").params({
        id: "1"
      });

      expect(response.statusCode).to.equal(204);
      expect(response.body).to.deep.equal("");
    });
  });
});