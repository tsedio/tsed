import {getContentType} from "./PlatformContentTypeResolver.js";

// Impact of isBoolean() on the response content type, for the Boolean constructor and boxed
// booleans (primitives as a baseline).
const INPUTS: Record<string, () => any> = {
  true: () => true,
  false: () => false,
  Boolean: () => Boolean,
  "new Boolean(true)": () => new Boolean(true),
  "new Boolean(false)": () => new Boolean(false)
};

describe("isBoolean impact on @tsed/platform-response-filter", () => {
  it("getContentType(value) without a declared content type", () => {
    const ctx: any = {
      endpoint: {view: undefined, operation: {getContentTypeOf: () => undefined}},
      response: {getContentType: () => undefined, statusCode: 200}
    };

    const result = Object.fromEntries(Object.entries(INPUTS).map(([name, value]) => [name, String(getContentType(value(), ctx))]));

    expect(result).toMatchSnapshot();
  });
});
