import {expect} from "chai";
import * as Sinon from "sinon";
import {Controller, ControllerRegistry} from "../../../../src/mvc";

class Test {
}

describe("Controller", () => {
  const sandbox = Sinon.createSandbox();
  let mergeStub: any;
  before(() => {
    mergeStub = sandbox.stub(ControllerRegistry, "merge");
  });
  after(() => {
    sandbox.restore();
  });
  describe("path(string) + dependencies", () => {
    before(() => {
      Controller("/test", [] as any)(Test);
    });

    it("should call merge method with an object", () => {
      mergeStub.should.have.been.calledWith(Test);
      expect(mergeStub.args[0][1].path).to.eq("/test");
      expect(mergeStub.args[0][1].dependencies).to.be.an("array");
    });
  });

  describe("path(regexp) + dependencies", () => {
    before(() => {
      Controller(/test/, [] as any)(Test);
    });
    after(() => {
    });
    it("should call merge method with an object", () => {
      mergeStub.should.have.been.calledWith(Test);
      expect(mergeStub.args[1][1].path).instanceof(RegExp);
    });
  });

  describe("path(array) + dependencies", () => {
    before(() => {
      Controller([/test/], [] as any)(Test);
    });
    after(() => {
    });
    it("should call merge method with an object", () => {
      mergeStub.should.have.been.calledWith(Test);
      expect(mergeStub.args[2][1].path).be.an("array");
    });
  });

  describe("object settigns", () => {
    before(() => {
      Controller({path: /test/, dependencies: []})(Test);
    });
    after(() => {
    });
    it("should call merge method with an object", () => {
      mergeStub.should.have.been.calledWith(Test);
      expect(mergeStub.args[3][1]).to.be.an("object");
    });
  });
});
