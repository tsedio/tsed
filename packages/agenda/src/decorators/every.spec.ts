import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Agenda} from "./agenda";
import {Every} from "./every";

describe("@Every()", () => {
  it("should set metadata", () => {
    @Agenda()
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

    expect(store.get("agenda").define).to.deep.eq({
      testEveryDecorator: {},
      testEveryDecorator2: {}
    });

    expect(store.get("agenda").every).to.deep.eq({
      testEveryDecorator: {
        interval: "60 seconds"
      },
      testEveryDecorator2: {
        interval: "* * * * *"
      }
    });
  });
});
