import {ParamMetadata, ParamTypes} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {DeserializerPipe} from "./DeserializerPipe";

const sandbox = Sinon.createSandbox();
describe("DeserializerPipe", () => {
  beforeEach(TestContext.create);
  beforeEach(TestContext.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it(
    "should transform an object to a model",
    TestContext.inject([DeserializerPipe], (pipe: DeserializerPipe) => {
      // @ts-ignore
      sandbox.stub(pipe.converterService, "deserialize").returns({});

      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        paramType: ParamTypes.REQUEST
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;
      // WHEN
      expect(pipe.transform({}, param)).to.deep.eq({});

      // @ts-ignore
      pipe.converterService.deserialize.should.have.been.calledWithExactly({}, Array, String);
    })
  );
});
