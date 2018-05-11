import {inject} from "@tsed/testing";
import {ControllerProvider} from "../../../../src/common/mvc/class/ControllerProvider";
import {ControllerService} from "../../../../src/common/mvc/services/ControllerService";
import {expect, Sinon} from "../../../tools";

class Test {
  constructor(private testService: TestService) {}

  test() {
    this.testService.fake();
  }
}

class TestService {
  constructor() {}

  fake() {}
}

// const pushRouterPath = Sinon.stub();

describe("ControllerService", () => {
  describe("get()", () => {
    before(() => {
      this.provider = new ControllerProvider(Test);
      ControllerService.set(Test, this.provider);
    });

    it("should return true", () => {
      expect(ControllerService.has(Test)).to.eq(true);
    });
    it("should return provider", () => {
      expect(ControllerService.get(Test)).to.eq(this.provider);
    });
  });

  describe("invoke()", () => {
    describe("when the controller hasn't a configured provider", () => {
      class Test2 {}

      before(
        inject([ControllerService], (controllerService: ControllerService) => {
          this.invokeStub = Sinon.stub((controllerService as any).injectorService, "invoke");

          controllerService.invoke(Test2);
        })
      );

      after(() => {
        this.invokeStub.restore();
      });

      it("should call the fake service", () => this.invokeStub.should.have.been.calledWithExactly(Test2, Sinon.match.any, undefined));
    });
  });
});
