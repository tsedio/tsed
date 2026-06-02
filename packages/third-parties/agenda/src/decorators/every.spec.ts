import {descriptorOf, Store} from "@tsed/core";

import {Every} from "./every.js";
import {JobsController} from "./jobController.js";

describe("@Every()", () => {
  it("should set metadata", () => {
    @JobsController()
    class Test {
      @Every("60 seconds")
      testEveryDecorator() {
        // test
      }

      @Every("* * * * *")
      testEveryDecorator2() {
        // test 2
      }
    }

    const store = Store.from(Test);

    expect(store.get("agenda").define).toEqual({
      testEveryDecorator: {},
      testEveryDecorator2: {}
    });

    expect(store.get("agenda").every).toEqual({
      testEveryDecorator: {
        interval: "60 seconds"
      },
      testEveryDecorator2: {
        interval: "* * * * *"
      }
    });
  });
});
