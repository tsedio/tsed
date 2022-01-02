import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import Sinon from "sinon";
import {BodyParams} from "../decorators/bodyParams";
import {QueryParams} from "../decorators/queryParams";
import {DeserializerPipe} from "./DeserializerPipe";
import {JsonParameterStore} from "@tsed/schema";

const sandbox = Sinon.createSandbox();

describe("DeserializerPipe", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  afterEach(() => {
    sandbox.restore();
  });
  it("should transform an object to a model", async () => {
    const pipe = await PlatformTest.get<DeserializerPipe>(DeserializerPipe);

    class Test {
      test(@BodyParams(String) input: string[]) {}
    }

    const param = JsonParameterStore.get(Test, "test", 0);

    // WHEN
    const result = pipe.transform(["test"], param);

    expect(result).to.deep.eq(["test"]);
  });
  it("should transform an object to a model (Query)", async () => {
    const pipe = await PlatformTest.get<DeserializerPipe>(DeserializerPipe);

    class Test {
      test(@QueryParams("test", String) input: string[]) {}
    }

    const param = JsonParameterStore.get(Test, "test", 0);

    // WHEN
    const result = pipe.transform(["test"], param);

    expect(result).to.deep.eq(["test"]);
  });
});
