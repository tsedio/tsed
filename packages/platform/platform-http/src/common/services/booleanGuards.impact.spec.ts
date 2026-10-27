import "../config/defineConfiguration.js";

import {$alter} from "@tsed/hooks";
import {JsonMapperSettings} from "@tsed/json-mapper";

import {PlatformTest} from "../../testing/PlatformTest.js";

vi.mock("on-finished");

// Impact of isBoolean() on @tsed/platform-http, for the Boolean constructor and boxed booleans
// (primitives as a baseline).
const INPUTS: Record<string, () => any> = {
  true: () => true,
  false: () => false,
  Boolean: () => Boolean,
  "new Boolean(true)": () => new Boolean(true),
  "new Boolean(false)": () => new Boolean(false)
};

describe("isBoolean impact on @tsed/platform-http", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  it("PlatformResponse.body(value): which writer is used", () => {
    const result: Record<string, string> = {};

    for (const [name, value] of Object.entries(INPUTS)) {
      const {response} = PlatformTest.createRequestContext();
      // end() and json() are protected: spy through an untyped reference
      const end = vi.spyOn(response as any, "end").mockReturnValue(response);
      const json = vi.spyOn(response as any, "json").mockReturnValue(response);

      try {
        response.body(value());
        result[name] = end.mock.calls.length ? "end()" : json.mock.calls.length ? "json()" : "none";
      } catch (er) {
        result[name] = `throws ${(er as Error).constructor.name}`;
      }
    }

    expect(result).toMatchSnapshot();
  });

  it("jsonMapper.additionalProperties configuration", () => {
    const original = JsonMapperSettings.additionalProperties;
    const result: Record<string, boolean | undefined> = {};

    try {
      for (const [name, value] of Object.entries(INPUTS)) {
        $alter("$alterConfig:jsonMapper", {additionalProperties: value()});
        result[name] = JsonMapperSettings.additionalProperties;
      }
    } finally {
      JsonMapperSettings.additionalProperties = original;
    }

    expect(result).toMatchSnapshot();
  });
});
