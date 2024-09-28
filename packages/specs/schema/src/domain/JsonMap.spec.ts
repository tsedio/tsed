import "../index.js";

import {JsonMap} from "./JsonMap.js";

describe("JsonMap", () => {
  it("should serialize a JsonMap", () => {
    const map = new JsonMap({
      id: "id"
    });

    expect(map.toJSON()).toEqual({
      id: "id"
    });
  });
});
