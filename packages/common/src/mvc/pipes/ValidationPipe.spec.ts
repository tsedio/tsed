import {ParamMetadata, ParamTypes, ParseExpressionError} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import {expect} from "chai";
import * as Sinon from "sinon";
import {ValidationPipe} from "./ValidationPipe";

const sandbox = Sinon.createSandbox();
describe("ValidationPipe", () => {
  beforeEach(TestContext.create);
  beforeEach(TestContext.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it(
    "should return value",
    TestContext.inject([ValidationPipe], (pipe: ValidationPipe) => {
      // @ts-ignore
      sandbox.stub(pipe.validationService, "validate");

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
      // @ts-ignore
      pipe.validationService.validate.should.have.been.calledWithExactly("value", String, Array);
    })
  );
  it(
    "should throw an error",
    TestContext.inject([ValidationPipe], (pipe: ValidationPipe) => {
      const error = new Error("message");
      // @ts-ignore
      sandbox.stub(pipe.validationService, "validate").callsFake(() => {
        throw error;
      });

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
      let actualError: any;
      try {
        pipe.transform("value", param);
      } catch (er) {
        actualError = er;
      }
      // @ts-ignore
      expect(actualError).to.instanceof(ParseExpressionError);
    })
  );
});
