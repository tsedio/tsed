import {getJsonSchema, Required} from "@tsed/schema";
import {expect} from "chai";
import {Groups} from "./groups";
import {RequiredGroups} from "./requiredGroups";

class MyModel {
  @Groups("!creation")
  id: string;

  @Required()
  prop1: string;

  @RequiredGroups("!patch")
  @Required()
  prop2: string;

  @RequiredGroups("patch")
  @Required()
  prop3: string;
}

describe("@RequiredGroups", () => {
  it("should have required fields filtered by groups (groups: false)", () => {
    const spec = getJsonSchema(MyModel, {
      groups: false
    });

    expect(spec).to.deep.equal({
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          minLength: 1,
          type: "string"
        },
        prop3: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["prop1", "prop2", "prop3"],
      type: "object"
    });
  });
  it("should have required fields filtered by groups (groups: [])", () => {
    const spec = getJsonSchema(MyModel, {
      groups: []
    });

    expect(spec).to.deep.equal({
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          minLength: 1,
          type: "string"
        },
        prop3: {
          type: "string"
        }
      },
      required: ["prop1", "prop2"],
      type: "object"
    });
  });
  it("should have required fields filtered by groups (groups: ['patch'])", () => {
    const spec = getJsonSchema(MyModel, {
      groups: ["patch"]
    });

    expect(spec).to.deep.equal({
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          type: "string"
        },
        prop3: {
          minLength: 1,
          type: "string"
        }
      },
      required: ["prop1", "prop3"],
      type: "object"
    });
  });
  it("should have required fields filtered by groups (groups: ['!patch'])", () => {
    const spec = getJsonSchema(MyModel, {
      groups: ["!patch"]
    });

    expect(spec).to.deep.equal({
      properties: {
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          minLength: 1,
          type: "string"
        },
        prop3: {
          type: "string"
        }
      },
      required: ["prop1", "prop2"],
      type: "object"
    });
  });
});
