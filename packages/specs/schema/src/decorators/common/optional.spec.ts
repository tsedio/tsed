import {In, Name, OperationPath, Optional, Property, Required, SpecTypes, getJsonSchema, getSpec} from "../../index.js";
import {Path} from "../operations/path.js";

describe("Optional", () => {
  it("should set metadata when optional is used on param", () => {
    @Path("/")
    class MyController {
      @OperationPath("GET", "/")
      method(@In("query") @Name("q") @Optional() q: string) {}
    }

    expect(getSpec(MyController, {specType: SpecTypes.OPENAPI})).toEqual({
      paths: {
        "/": {
          get: {
            operationId: "myControllerMethod",
            parameters: [
              {
                in: "query",
                name: "q",
                required: false,
                schema: {
                  type: "string"
                }
              }
            ],
            responses: {
              "200": {
                description: "Success"
              }
            },
            tags: ["MyController"]
          }
        }
      },
      tags: [
        {
          name: "MyController"
        }
      ]
    });
  });

  it("should remove a required property inherited from the parent class", () => {
    class Parent {
      @Required()
      id: string;

      @Required()
      description: string;
    }

    class Child extends Parent {
      @Optional()
      @Property()
      declare description: string;
    }

    expect(getJsonSchema(Child).required).toEqual(["id"]);
    expect(getJsonSchema(Parent).required).toEqual(["id", "description"]);
  });

  it("should keep a required property inherited from the parent class when it is redeclared without @Optional()", () => {
    class Parent {
      @Required()
      description: string;
    }

    class Child extends Parent {
      @Property()
      declare description: string;
    }

    expect(getJsonSchema(Child).required).toEqual(["description"]);
  });

  it("should not emit a required list when the child makes the only inherited required property optional", () => {
    class Parent {
      @Required()
      id: string;
    }

    class Child extends Parent {
      @Optional()
      @Property()
      declare id: string;
    }

    expect(getJsonSchema(Child).required).toBeUndefined();
    expect(getJsonSchema(Parent).required).toEqual(["id"]);
  });
});
