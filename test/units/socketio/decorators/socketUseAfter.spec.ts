import {Store} from "@tsed/core";
import {SocketUseAfter} from "../../../../packages/socketio/src";
import {expect} from "../../../tools";

describe("@SocketUseAfter", () => {
  describe("when the decorator is used on a class", () => {
    class Test {}

    before(() => {
      this.middleware = () => {};
      SocketUseAfter(this.middleware)(Test);
    });

    it("should store metadata", () => {
      expect(Store.from(Test).get("socketIO")).to.deep.eq({
        useAfter: [this.middleware]
      });
    });
  });

  describe("when the decorator is used on a method", () => {
    class Test {}

    before(() => {
      this.middleware = () => {};
      SocketUseAfter(this.middleware)(Test, "test", {});
    });

    it("should store metadata", () => {
      expect(Store.from(Test).get("socketIO")).to.deep.eq({
        handlers: {
          test: {
            useAfter: [this.middleware]
          }
        }
      });
    });
  });
});
