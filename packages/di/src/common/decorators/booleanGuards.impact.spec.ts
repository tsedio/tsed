import {DITest} from "../../node/index.js";
import {constant} from "../fn/constant.js";
import {Constant} from "./constant.js";

// Impact of isBoolean()/isPrimitive() (used by deepClone/deepMerge) on configuration values read
// through @tsed/di, for the Boolean constructor and boxed booleans (primitives as a baseline).
const INPUTS: Record<string, () => any> = {
  true: () => true,
  false: () => false,
  Boolean: () => Boolean,
  "new Boolean(true)": () => new Boolean(true),
  "new Boolean(false)": () => new Boolean(false)
};

function describeValue(value: any): string {
  if (value === Boolean) {
    return "Boolean constructor";
  }

  if (value instanceof Boolean) {
    try {
      return `Boolean object, valueOf() = ${value.valueOf()}`;
    } catch (er) {
      return `Boolean-like object, valueOf() throws ${(er as Error).constructor.name}`;
    }
  }

  return `${typeof value} ${String(value)}`;
}

async function table(scenario: () => any | Promise<any>) {
  const result: Record<string, string> = {};

  for (const [name, value] of Object.entries(INPUTS)) {
    await DITest.create({custom: {flag: value()}} as any);

    try {
      result[name] = describeValue(await scenario());
    } catch (er) {
      result[name] = `throws ${(er as Error).constructor.name}`;
    } finally {
      await DITest.reset();
    }
  }

  return result;
}

describe("isBoolean/isPrimitive impact on @tsed/di configuration", () => {
  it("constant('custom.flag')", async () => {
    expect(await table(() => constant("custom.flag"))).toMatchSnapshot();
  });

  it("@Constant('custom.flag')", async () => {
    class Test {
      @Constant("custom.flag")
      flag: any;
    }

    expect(await table(async () => (await DITest.invoke<Test>(Test)).flag)).toMatchSnapshot();
  });
});
