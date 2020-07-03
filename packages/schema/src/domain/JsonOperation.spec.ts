import {descriptorOf} from "@tsed/core";
import {JsonEntityStore, OperationPath, Returns} from "@tsed/schema";
import {expect} from "chai";

describe("JsonOperation", () => {
  it("getStatus()", () => {
    class MyController {
      @OperationPath("GET", "/")
      @(Returns(200).Header("x-token", "token"))
      @(Returns(200).Header("x-token2", "token2"))
      method() {}
    }

    const entity = JsonEntityStore.from(MyController.prototype, "method", descriptorOf(MyController, "method"));

    expect(entity.operation?.getStatus()).to.equal(200);
    expect(entity.operation?.status).to.equal(200);
    expect(entity.operation?.response?.toJSON()).to.deep.equal({
      description: "Success",
      headers: {
        "x-token2": {example: "token2", type: "string"},
        "x-token": {example: "token", type: "string"}
      },
      schema: {type: "string"}
    });
    expect(entity.operation?.getHeadersOf(200)).to.deep.equal({
      "x-token": {
        example: "token",
        type: "string"
      },
      "x-token2": {
        example: "token2",
        type: "string"
      }
    });
  });
});
