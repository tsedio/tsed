import {Hooks} from "@tsed/hooks";

import {s} from "../fn/index.js";
import {alterIgnore} from "./alterIgnore.js";
import {alterOneOf} from "./alterOneOf.js";

// Impact of isBoolean() on @tsed/schema hooks, for the Boolean constructor and boxed booleans
// (primitives as a baseline).
const INPUTS: Record<string, () => any> = {
  true: () => true,
  false: () => false,
  Boolean: () => Boolean,
  "new Boolean(true)": () => new Boolean(true),
  "new Boolean(false)": () => new Boolean(false)
};

function table(scenario: (value: any) => any) {
  return Object.fromEntries(
    Object.entries(INPUTS).map(([name, value]) => {
      try {
        return [name, JSON.stringify(scenario(value()))];
      } catch (er) {
        return [name, `throws ${(er as Error).constructor.name}`];
      }
    })
  );
}

describe("isBoolean impact on @tsed/schema", () => {
  it("alterIgnore({$ignore: value})", () => {
    expect(table((value) => alterIgnore({$hooks: new Hooks(), $ignore: value}, {groups: false}))).toMatchSnapshot();
  });

  it("alterOneOf(): boolean enum values kept on the boolean branch", () => {
    expect(
      table((value) => {
        const obj = alterOneOf({oneOf: [{type: "string"}, {type: "boolean"}], enum: ["a", value]}, s.string(), {groups: false});

        return obj.oneOf[1].enum.map((item: any) => (item === Boolean ? "Boolean constructor" : `${typeof item} ${String(item)}`));
      })
    ).toMatchSnapshot();
  });
});
