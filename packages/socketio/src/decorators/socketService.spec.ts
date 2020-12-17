import {Store} from "@tsed/core";
import {expect} from "chai";
import Sinon from "sinon";

const registerSocketService: any = Sinon.stub();
const {SocketService} = require("proxyquire")("../../src/decorators/socketService", {
  "../registries/SocketServiceRegistry": {registerSocketService}
});

describe("SocketService", () => {
  describe("case 1", () => {
    class Test {}

    before(() => {
      SocketService("/namespace")(Test);
      this.store = Store.from(Test);
    });
    after(() => {
      registerSocketService.reset();
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        namespace: "/namespace",
        type: "service"
      });
    });

    it("should call socketServiceRegistry", () => {
      expect(registerSocketService).to.have.been.calledWithExactly(Test);
    });
  });
  describe("case 2", () => {
    class Test {}

    before(() => {
      SocketService()(Test);
      this.store = Store.from(Test);
    });
    after(() => {
      registerSocketService.reset();
    });

    it("should set metadata", () => {
      expect(this.store.get("socketIO")).to.deep.eq({
        namespace: "/",
        type: "service"
      });
    });
    it("should call socketServiceRegistry", () => {
      expect(registerSocketService).to.have.been.calledWithExactly(Test);
    });
  });
});
