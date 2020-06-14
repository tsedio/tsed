import {Store} from "@tsed/core";
import {expect} from "chai";
import {ResponseViewMiddleware} from "../middlewares/ResponseViewMiddleware";
import {ResponseView} from "./responseView";

describe("ResponseView", () => {
  it("should set metadata", () => {
    class Test {
      @ResponseView("page", {})
      test() {}
    }

    const store = Store.fromMethod(Test, "test");
    expect(store.get(ResponseViewMiddleware)).to.deep.eq({
      viewPath: "page",
      viewOptions: {}
    });
  });
});
