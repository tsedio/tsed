import {Store} from "@tsed/core";
import {SocketUseBefore} from "../../../../packages/socketio";
import {expect} from "../../../tools";

describe("@SocketUseBefore", () => {
  describe("when the decorator is used on a class", () => {
    class Test {}

    before(() => {
      this.middleware = () => {};
      SocketUseBefore(this.middleware)(Test);
    });

    it("should store metadata", () => {
      expect(Store.from(Test).get("socketIO")).to.deep.eq({
        useBefore: [this.middleware]
      });
    });
  });

  describe("when the decorator is used on a method", () => {
    class Test {}

    before(() => {
      this.middleware = () => {};
      SocketUseBefore(this.middleware)(Test, "test", {});
    });

    it("should store metadata", () => {
      expect(Store.from(Test).get("socketIO")).to.deep.eq({
        handlers: {
          test: {
            useBefore: [this.middleware]
          }
        }
      });
    });
  });
});
