import {ParamMetadata, ParamTypes, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {DeserializerPipe} from "./DeserializerPipe";

const sandbox = Sinon.createSandbox();
describe("DeserializerPipe", () => {
  beforeEach(PlatformTest.create);
  beforeEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it(
    "should transform an object to a model",
    PlatformTest.inject([DeserializerPipe], (pipe: DeserializerPipe) => {
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
      expect(pipe.converterService.deserialize).to.have.been.calledWithExactly({}, Array, String, {additionalProperties: undefined});
    })
  );
  it(
    "should transform an object to a model (Query)",
    PlatformTest.inject([DeserializerPipe], (pipe: DeserializerPipe) => {
      // @ts-ignore
      sandbox.stub(pipe.converterService, "deserialize").returns({});

      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        paramType: ParamTypes.QUERY
      });
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;
      // WHEN
      expect(pipe.transform({}, param)).to.deep.eq({});

      // @ts-ignore
      expect(pipe.converterService.deserialize).to.have.been.calledWithExactly({}, Array, String, {additionalProperties: "ignore"});
    })
  );
});
