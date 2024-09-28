import {Store} from "@tsed/core";
import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";
import {Format, getJsonSchema, getSpec, Post, Property, ReadOnly, Returns, SpecTypes} from "@tsed/schema";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Model} from "./model.js";
import {VirtualRef, VirtualRefs} from "./virtualRef.js";

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
        @VirtualRef({ref: "RefTest", foreignField: "foreign"})
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
          ref: "RefTest",
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
                  anyOf: [
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
        member: VirtualRef<VirtualRefStringTestPerson>;

        @VirtualRef({
          ref: "VirtualRefStringTestPerson",
          foreignField: "foreign",
          localField: "test_2",
          justOne: false,
          count: false,
          options: {}
        })
        members: VirtualRefStringTestPerson[];

        @VirtualRef({
          ref: "VirtualRefStringTestPerson",
          foreignField: "foreign",
          localField: "test_2",
          count: true,
          options: {}
        })
        memberCount: number;
      }

      @Model()
      class VirtualRefStringTestPerson {
        @Property()
        name: string;

        @Property()
        band: string;
      }

      // THEN
      const membersStore = Store.from(VirtualRefStringTestBand, "members");
      const memberStore = Store.from(VirtualRefStringTestBand, "member");
      const memberCount = Store.from(VirtualRefStringTestBand, "memberCount");

      expect(memberStore.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualRefStringTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: true,
        count: false,
        options: {}
      });

      expect(membersStore.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualRefStringTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: false,
        count: false,
        options: {}
      });

      expect(memberCount.get(MONGOOSE_SCHEMA)).toEqual({
        ref: "VirtualRefStringTestPerson",
        localField: "test_2",
        foreignField: "foreign",
        justOne: false,
        count: true,
        options: {}
      });

      const schema = getJsonSchema(VirtualRefStringTestBand);

      expect(schema).toEqual({
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
            type: "array",
            items: {
              $ref: "#/definitions/VirtualRefStringTestPerson"
            }
          },
          member: {
            $ref: "#/definitions/VirtualRefStringTestPerson"
          },
          memberCount: {
            type: "number"
          }
        },
        type: "object"
      });
    });
  });
});
