import {Format, getJsonSchema, getSpec, In, Path, Post, Property, Returns, SpecTypes} from "@tsed/schema";
import {expect} from "chai";
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

    expect(schema).to.deep.equal({
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
    expect(getSpec(MyCtrl, {specType: SpecTypes.OPENAPI})).to.deep.equal({
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
                allOf: [
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
  it("should declare property as readonly (OS2)", () => {
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
    expect(getSpec(MyCtrl, {specType: SpecTypes.SWAGGER})).to.deep.equal({
      definitions: {
        TestBand: {
          properties: {
            createdAt: {
              format: "date-time",
              type: "number"
            },
            members: {
              allOf: [
                {
                  $ref: "#/definitions/TestPerson"
                }
              ],
              readOnly: true
            },
            updatedAt: {
              format: "date-time",
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
      },
      paths: {
        "/": {
          post: {
            operationId: "myCtrlPost",
            parameters: [
              {
                in: "body",
                name: "body",
                required: false,
                schema: {
                  $ref: "#/definitions/TestBand"
                }
              }
            ],
            produces: ["application/json"],
            responses: {
              "200": {
                description: "Success",
                schema: {
                  $ref: "#/definitions/TestBand"
                }
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
