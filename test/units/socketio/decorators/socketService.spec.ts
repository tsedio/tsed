import {Store} from "../../../../packages/core/class/Store";
import {SocketService} from "../../../../packages/socketio";
import {expect} from "../../../tools";

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
