import {inject} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ControllerProvider, ControllerService} from "../../../src/mvc";

class Test {
  constructor(private testService: TestService) {
  }

  test() {
    this.testService.fake();
  }
}

class TestService {
  constructor() {
  }

  fake() {
  }
}

// const pushRouterPath = Sinon.stub();

describe("ControllerService", () => {
  describe("get()", () => {
    let provider: ControllerProvider;
    before(() => {
      provider = new ControllerProvider(Test);
      ControllerService.set(Test, provider);
    });

    it("should return true", () => {
      expect(ControllerService.has(Test)).to.eq(true);
    });
    it("should return provider", () => {
      expect(ControllerService.get(Test)).to.eq(provider);
    });
  });

  describe("invoke()", () => {
    describe("when the controller hasn't a configured provider", () => {
      class Test2 {
      }

      let invokeStub: any;

      before(
        inject([ControllerService], (controllerService: ControllerService) => {
          invokeStub = Sinon.stub((controllerService as any).injectorService, "invoke");

          controllerService.invoke(Test2);
        })
      );

      after(() => {
        invokeStub.restore();
      });

      it("should call the fake service", () => {
        return invokeStub.should.have.been.calledWithExactly(Test2, Sinon.match.any);
      });
    });
  });
});
