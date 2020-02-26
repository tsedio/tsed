import {ParamMetadata, ParamTypes, RequiredParamError} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {RequiredPipe} from "./RequiredPipe";

const sandbox = Sinon.createSandbox();
describe("RequiredPipe", () => {
  beforeEach(TestContext.create);
  beforeEach(TestContext.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it(
    "should return value (no required)",
    TestContext.inject([RequiredPipe], (pipe: RequiredPipe) => {
      // @ts-ignore
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
      expect(pipe.transform("value", param)).to.deep.eq("value");
    })
  );
  it(
    "should return value (required)",
    TestContext.inject([RequiredPipe], (pipe: RequiredPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        paramType: ParamTypes.REQUEST
      });
      param.required = true;
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      // WHEN
      expect(pipe.transform("value", param)).to.deep.eq("value");
    })
  );
  it(
    "should do throw an error",
    TestContext.inject([RequiredPipe], (pipe: RequiredPipe) => {
      // @ts-ignore
      class Test {}

      const param = new ParamMetadata({
        index: 0,
        target: Test,
        propertyKey: "test",
        paramType: ParamTypes.REQUEST
      });
      param.required = true;
      // @ts-ignore
      param._type = String;
      param.collectionType = Array;

      // WHEN
      let actualError: any;
      try {
        pipe.transform("", param);
      } catch (error) {
        actualError = error;
      }
      expect(actualError).to.be.instanceof(RequiredParamError);
    })
  );
});
