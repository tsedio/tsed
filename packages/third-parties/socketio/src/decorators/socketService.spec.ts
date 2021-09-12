import {Store} from "@tsed/core";
import {SocketService} from "@tsed/socketio";
import {expect} from "chai";
import Sinon from "sinon";

const registerSocketService: any = Sinon.stub();

describe("SocketService", () => {
  describe("case 1", () => {
    class Test {}

    before(() => {});
    after(() => {
      registerSocketService.reset();
    });

    it("should set metadata", () => {
      SocketService("/namespace")(Test);
      const store = Store.from(Test);

      expect(store.get("socketIO")).to.deep.eq({
        namespace: "/namespace",
        type: "service"
      });
    });
  });
  describe("case 2", () => {
    class Test {}

    before(() => {});
    after(() => {
      registerSocketService.reset();
    });

    it("should set metadata", () => {
      SocketService()(Test);
      const store = Store.from(Test);

      expect(store.get("socketIO")).to.deep.eq({
        namespace: "/",
        type: "service"
      });
    });
  });
});
