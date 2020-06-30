import {ParamMetadata, ParamTypes} from "@tsed/common";
import {catchError} from "@tsed/core";
import {expect} from "chai";
import * as Sinon from "sinon";
import {QueryParams} from "../decorators/params/queryParams";
import {ValidationPipe} from "./ValidationPipe";

describe("ValidationPipe", () => {
  it("should return value", async () => {
    const validate = Sinon.stub();
    const validator = new ValidationPipe({
      validate
    });

    class Test {
    }

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
    expect(validator.transform("value", param)).to.deep.eq("value");
    // @ts-ignore
    expect(validate).to.have.been.calledWithExactly("value", String, Array);
  });

  it("should throw an error", async () => {
    const error = new Error("message");
    const validator = new ValidationPipe({
      validate() {
        throw error;
      }
    });

    class Test {
      test(@QueryParams("param", String) param: string[]) {
      }
    }

    // WHEN
    const actualError = catchError(() => validator.transform("value", ParamMetadata.get(Test, "test", 0)));
    // @ts-ignore
    expect(actualError.message).to.eq("message");
  });
});
