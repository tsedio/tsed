import {Format, getJsonSchema, getSpec, In, Path, Post, Property, Returns, SpecTypes} from "../../index";
import {ReadOnly} from "./readOnly";

describe("@ReadOnly", () => {
  it("should declare readOnly field", () => {
    // WHEN
    class Model {
      @ReadOnly(true)
      num: string;
    }

    // THEN
    const schema = getJsonSchema(Model);

    expect(schema).toEqual({
      properties: {
        num: {
          readOnly: true,
          type: "string"
        }
      },
      type: "object"
    });
  });

  it("should declare property as readonly (OS3)", () => {
    class TestPerson {
      @Property()
      name: string;

      @Property()
      band: string;
    }

    // WHEN
    class TestBand {
      @Format("date-time")
      @ReadOnly()
      createdAt: number = Date.now();

      @Format("date-time")
      @ReadOnly()
      updatedAt: number = Date.now();

      @ReadOnly()
      @Property(TestPerson)
      members: TestPerson;
    }

    @Path("/")
    class MyCtrl {
      @Post("/")
      @Returns(200, TestBand)
      post(@In("body") model: TestBand) {}
    }

    // THEN
    expect(getSpec(MyCtrl, {specType: SpecTypes.OPENAPI})).toEqual({
      components: {
        schemas: {
          TestBand: {
            properties: {
              createdAt: {
                format: "date-time",
                readOnly: true,
                type: "number"
              },
              members: {
                oneOf: [
                  {
                    $ref: "#/components/schemas/TestPerson"
                  }
                ],
                readOnly: true
              },
              updatedAt: {
                format: "date-time",
                readOnly: true,
                type: "number"
              }
            },
            type: "object"
          },
          TestPerson: {
            properties: {
              band: {
                type: "string"
              },
              name: {
                type: "string"
              }
            },
            type: "object"
          }
        }
      },
      paths: {
        "/": {
          post: {
            operationId: "myCtrlPost",
            parameters: [],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TestBand"
                  }
                }
              },
              required: false
            },
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TestBand"
                    }
                  }
                },
                description: "Success"
              }
            },
            tags: ["MyCtrl"]
          }
        }
      },
      tags: [
        {
          name: "MyCtrl"
        }
      ]
    });
  });
});
