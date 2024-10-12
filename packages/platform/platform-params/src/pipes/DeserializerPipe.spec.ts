import {PlatformTest} from "@tsed/platform-http/testing";
import {JsonParameterStore} from "@tsed/schema";

import {BodyParams} from "../decorators/bodyParams.js";
import {QueryParams} from "../decorators/queryParams.js";
import {DeserializerPipe} from "./DeserializerPipe.js";

describe("DeserializerPipe", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should transform an object to a model", async () => {
    const pipe = await PlatformTest.get<DeserializerPipe>(DeserializerPipe);

    class Test {
      test(@BodyParams(String) input: string[]) {}
    }

    const param = JsonParameterStore.get(Test, "test", 0);

    // WHEN
    const result = pipe.transform(["test"], param);

    expect(result).toEqual(["test"]);
  });
  it("should transform an object to a model (Query)", async () => {
    const pipe = await PlatformTest.get<DeserializerPipe>(DeserializerPipe);

    class Test {
      test(@QueryParams("test", String) input: string[]) {}
    }

    const param = JsonParameterStore.get(Test, "test", 0);

    // WHEN
    const result = pipe.transform(["test"], param);

    expect(result).toEqual(["test"]);
  });
});
