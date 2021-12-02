import {Default, Format, getJsonSchema, getSpec, Post, Property, ReadOnly, Returns, SpecTypes} from "@tsed/schema";
import {Store} from "@tsed/core";
import {Model} from "@tsed/mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {VirtualRef} from "./virtualRef";
import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";

describe("@VirtualRef()", () => {
  describe("when type and foreign value are given", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef("RefTest", "foreign")
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        justOne: false,
        count: false,
        foreignField: "foreign",
        localField: "_id",
        options: undefined
      });
    });
  });

  describe("when options is given with minimal fields", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef({type: "RefTest", foreignField: "foreign"})
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        localField: "_id",
        foreignField: "foreign",
        justOne: false,
        count: false,
        options: undefined
      });
    });
  });

  describe("when options is given with all fields", () => {
    it("should set metadata", () => {
      // WHEN
      class Test {
        @VirtualRef({
          type: "RefTest",
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          count: true,
          options: {}
        })
        test: any;
      }

      // THEN
      const store = Store.from(Test, "test");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "RefTest",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        count: true,
        options: {}
      });
    });
  });

  describe("with a given model", () => {
    it("should set metadata", () => {
      @Model({name: "VirtualTestPerson"})
      class TestPerson {
        @Property()
        name: string;

        @Property()
        band: string;
      }

      // WHEN
      @Model({name: "VirtualTestBand"})
      class TestBand {
        @VirtualRef({
          ref: TestPerson,
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          count: false,
          options: {}
        })
        members: VirtualRef<TestPerson>;
      }

      // THEN
      const store = Store.from(TestBand, "members");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        count: false,
        options: {}
      });

      expect(getJsonSchema(TestBand)).toEqual({
        definitions: {
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
        properties: {
          members: {
            $ref: "#/definitions/TestPerson"
          }
        },
        type: "object"
      });
    });
    it("should generate spec", () => {
      @Model({name: "VirtualTestPerson"})
      class TestPerson {
        @Property()
        name: string;

        @Property()
        band: string;
      }

      // WHEN
      @Model({name: "VirtualTestBand"})
      class TestBand {
        @Format("date-time")
        @ReadOnly()
        createdAt: number = Date.now();

        @Format("date-time")
        @ReadOnly()
        updatedAt: number = Date.now();

        @ReadOnly()
        @VirtualRef({
          ref: TestPerson,
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          options: {}
        })
        members: VirtualRef<TestPerson>;
      }

      @Controller("/")
      class MyCtrl {
        @Post("/")
        @Returns(200, TestBand)
        post(@BodyParams() model: TestBand) {}
      }

      // THEN
      const store = Store.from(TestBand, "members");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        count: false,
        options: {}
      });

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
  });

  describe("with a given model as string ref", () => {
    it("should set metadata and json schema", () => {
      @Model()
      class VirtualRefStringTestPerson {
        @Property()
        name: string;

        @Property()
        band: string;
      }

      // WHEN
      @Model()
      class VirtualRefStringTestBand {
        @VirtualRef({
          ref: "VirtualRefStringTestPerson",
          foreignField: "foreign",
          localField: "test_2",
          justOne: true,
          count: false,
          options: {}
        })
        members: VirtualRef<VirtualRefStringTestPerson>;
      }

      // THEN
      const store = Store.from(VirtualRefStringTestBand, "members");

      expect(store.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualRefStringTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        count: false,
        options: {}
      });

      expect(getJsonSchema(VirtualRefStringTestBand)).toEqual({
        definitions: {
          VirtualRefStringTestPerson: {
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
        properties: {
          members: {
            $ref: "#/definitions/VirtualRefStringTestPerson"
          }
        },
        type: "object"
      });
    });
  });
});
