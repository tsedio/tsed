import {GlobalProviders} from "@tsed/di";

import {Temporal} from "./temporal.js";

describe("@Activity()", () => {
  it("should set metadata", () => {
    @Temporal()
    class Test {}

    expect(GlobalProviders.get(Test)?.useClass).toEqual(Test);
  });
});
