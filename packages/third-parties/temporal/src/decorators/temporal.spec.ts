import {Provider} from "@tsed/di";

import {Temporal} from "./temporal.js";

describe("@Activity()", () => {
  it("should set metadata", () => {
    @Temporal()
    class Test {}

    expect(Provider.Registry.get(Test)?.useClass).toEqual(Test);
  });
});
