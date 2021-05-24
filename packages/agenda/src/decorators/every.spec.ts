import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Agenda} from "./agenda";
import {Every} from "./every";

describe("@Every()", () => {
  it("should set metadata", () => {
    @Agenda()
    class Test {
      @Every({interval: "60 seconds"})
      testEveryDecorator() {
        // test
      }

      @Every({interval: "* * * * *"})
      testEveryDecorator2() {
        // test 2
      }
    }

    const store = Store.from(Test);

    expect(store.get("agenda").define).to.deep.eq({
      testEveryDecorator: {
        descriptor: descriptorOf(Test, "testEveryDecorator"),
        options: {
          name: undefined,
          options: undefined
        }
      },
      testEveryDecorator2: {
        descriptor: descriptorOf(Test, "testEveryDecorator2"),
        options: {}
      }
    });

    expect(store.get("agenda").every).to.deep.eq({
      testEveryDecorator: {
        options: {
          interval: "60 seconds"
        }
      },
      testEveryDecorator2: {
        options: {
          interval: "* * * * *"
        }
      }
    });
  });
});
