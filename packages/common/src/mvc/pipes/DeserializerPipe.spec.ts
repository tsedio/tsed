import {ParamMetadata, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as Sinon from "sinon";
import {BodyParams} from "../decorators/params/bodyParams";
import {QueryParams} from "../decorators/params/queryParams";
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
      sandbox.spy(pipe.converterService, "deserialize");

      class Test {
        test(@BodyParams(String) input: string[]) {}
      }

      const param = ParamMetadata.get(Test, "test", 0);

      // WHEN
      const result = pipe.transform(["test"], param);

      expect(result).to.deep.eq(["test"]);

      // @ts-ignore
      expect(pipe.converterService.deserialize).to.have.been.calledWithExactly(["test"], {
        groups: undefined,
        collectionType: Array,
        type: String
      });
    })
  );
  it(
    "should transform an object to a model (Query)",
    PlatformTest.inject([DeserializerPipe], (pipe: DeserializerPipe) => {
      // @ts-ignore
      sandbox.spy(pipe.converterService, "deserialize");

      class Test {
        test(@QueryParams("test", String) input: string[]) {}
      }

      const param = ParamMetadata.get(Test, "test", 0);

      // WHEN
      const result = pipe.transform(["test"], param);

      expect(result).to.deep.eq(["test"]);

      // @ts-ignore
      expect(pipe.converterService.deserialize).to.have.been.calledWithExactly(["test"], {
        collectionType: Array,
        type: String,
        groups: undefined
      });
    })
  );
});
