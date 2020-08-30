import {expect} from "chai";
import {EndpointMetadata, ReturnType} from "../../../../src/mvc";

describe("ReturnType", () => {
  it("should store metadata (when code is given)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @ReturnType({
        code: 200,
        type: TypeC,
        collectionType: Array,
        headers: {
          // @ts-ignore
          "x-header": {
            value: "test",
          },
        },
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointMetadata.get(Test, "get");

    expect(endpoint.statusCode).to.eq(200);
    expect(endpoint.responses.get(200)).to.deep.eq({
      code: 200,
      collectionType: Array,
      type: TypeC,
      description: "",
      headers: {
        "x-header": {
          value: "test",
        },
      },
    });
  });
  it("should store metadata (when code is not given)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @ReturnType({
        type: TypeC,
        collectionType: Array,
        headers: {
          // @ts-ignore
          "x-header": {
            value: "test",
          },
        },
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointMetadata.get(Test, "get");
    expect(endpoint.statusCode).to.eq(200);
    expect(endpoint.responses.get(200)).to.deep.eq({
      code: 200,
      collectionType: Array,
      type: TypeC,
      description: "",
      headers: {
        "x-header": {
          value: "test",
        },
      },
    });
  });
});
