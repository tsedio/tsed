import {Store} from "@tsed/core";
import {SocketService} from "../../../../packages/socketio/src";
import {expect} from "chai";

describe("SocketService", () => {
  describe("case 1", () => {
    class Test {}

    before(() => {
      SocketService("/namespace")(Test);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        namespace: "/namespace",
        type: "service"
      });
    });
  });
  describe("case 2", () => {
    class Test {}

    before(() => {
      SocketService()(Test);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        namespace: "/",
        type: "service"
      });
    });
  });
});
