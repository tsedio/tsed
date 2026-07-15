import {defineType, getTypeResolver} from "./JsonTypesContainer.js";

describe("JsonTypesContainer", () => {
  it("should resolve a type registered after an initial cache miss", () => {
    class LateBoundType {}

    expect(getTypeResolver(LateBoundType)).toBeUndefined();

    const resolver = defineType({
      name: "late-bound-type",
      match: (type) => type === LateBoundType
    });

    expect(getTypeResolver(LateBoundType)).toBe(resolver);
  });
});
