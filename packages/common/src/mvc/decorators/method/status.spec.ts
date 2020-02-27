import "@tsed/swagger";
import {expect} from "chai";
import {EndpointRegistry, Status} from "../../../../src/mvc";

describe("Status", () => {
  it("should store metadata (200)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Status(200, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointRegistry.get(Test, "get");

    const response = {
      code: 200,
      collectionType: Array,
      description: "description",
      type: TypeC,
      headers: {
        "x-header": {
          type: "string"
        }
      }
    };

    expect(endpoint.responses.get(200)).to.deep.eq(response);
    expect(endpoint.statusCode).to.eq(200);
  });
  it("should store metadata (204)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Status(204, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointRegistry.get(Test, "get");

    const response = {
      code: 204,
      collectionType: Array,
      description: "description",
      type: TypeC,
      headers: {
        "x-header": {
          type: "string"
        }
      }
    };

    expect(endpoint.responses.get(204)).to.deep.eq(response);
    expect(endpoint.statusCode).to.eq(204);
  });
  it("should store metadata (201)", () => {
    // GIVEN
    class TypeC {}

    // WHEN
    class Test {
      @Status(201, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-header": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointRegistry.get(Test, "get");

    const response = {
      code: 201,
      collectionType: Array,
      description: "description",
      type: TypeC,
      headers: {
        "x-header": {
          type: "string"
        }
      }
    };

    expect(endpoint.responses.get(201)).to.deep.eq(response);
    expect(endpoint.statusCode).to.eq(201);
  });
  it("should store metadata (404)", () => {
    // GIVEN
    class TypeC {}

    class CustomError {}

    // WHEN
    class Test {
      @Status(404, {
        type: CustomError,
        description: "description",
        headers: {
          "x-error": {
            type: "string"
          }
        }
      })
      @Status(200, {
        type: TypeC,
        collectionType: Array,
        description: "description",
        headers: {
          "x-map": {
            type: "string"
          }
        }
      })
      get() {}
    }

    // THEN
    const endpoint = EndpointRegistry.get(Test, "get");
    expect(endpoint.responses.get(404)).to.deep.eq({
      code: 404,
      description: "description",
      type: CustomError,
      headers: {
        "x-error": {
          type: "string"
        }
      }
    });
    expect(endpoint.statusCode).to.eq(200);
    expect(endpoint.responses.get(200)).to.deep.eq({
      code: 200,
      collectionType: Array,
      description: "description",
      type: TypeC,
      headers: {
        "x-map": {
          type: "string"
        }
      }
    });
  });
});
