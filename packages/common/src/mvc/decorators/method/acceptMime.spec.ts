import {AcceptMime, AcceptMimesMiddleware, Get} from "@tsed/common";
import {Store} from "@tsed/core";
import {getSpec} from "@tsed/schema";
import {expect} from "chai";

describe("AcceptMime", () => {
  it("should set metadata", () => {
    class Test {
      @Get("/")
      @AcceptMime("application/json")
      test() {}
    }

    const store = Store.fromMethod(Test, "test");
    expect(store.get(AcceptMimesMiddleware)).to.deep.eq(["application/json"]);
    const spec = getSpec(Test);

    expect(spec).to.deep.eq({
      paths: {
        "/": {
          get: {
            produces: ["application/json"],
            operationId: "testTest",
            parameters: [],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["Test"]
          }
        }
      },
      tags: [
        {
          name: "Test"
        }
      ]
    });
  });
});
