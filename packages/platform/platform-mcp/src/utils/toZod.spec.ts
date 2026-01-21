import {s, string} from "@tsed/schema";

import {toZod} from "./toZod.js";

describe("toZod", () => {
  it("should transform JsonSchema to Zod instance", async () => {
    const schema = s.object({
      prop1: string()
    });

    const result = toZod(schema);

    expect(result?.toJSONSchema).toBeDefined();
  });
});
