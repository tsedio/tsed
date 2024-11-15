import {Controller} from "@tsed/di";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {
  DiscriminatorKey,
  DiscriminatorValue,
  Enum,
  enums,
  Get,
  getJsonSchema,
  getSpec,
  JsonEntityStore,
  Name,
  OneOf,
  Partial,
  Patch,
  Post,
  Property,
  Put,
  Required,
  Returns
} from "../../src/index.js";

export enum EventType {
  PAGE_VIEW = "page_view",
  ACTION = "action",
  CLICK_ACTION = "click_action"
}

enums(EventType);

class Event {
  @DiscriminatorKey() // declare this property a discriminator key
  type: EventType;

  @Property()
  value: string;
}

class SubEvent extends Event {
  @Property()
  meta: string;
}

@DiscriminatorValue(EventType.PAGE_VIEW) // or @DiscriminatorValue() value can be inferred by the class name
class PageView extends SubEvent {
  override readonly type = EventType.PAGE_VIEW;

  @Required()
  url: string;
}

@DiscriminatorValue(EventType.ACTION, EventType.CLICK_ACTION)
class Action extends SubEvent {
  @Required()
  event: string;
}

@DiscriminatorValue()
class CustomAction extends Event {
  @Required()
  event: string;

  @Property()
  meta: string;
}

type OneOfEvents = PageView | Action | CustomAction;

describe("Discriminator", () => {
  describe("jsonschema", () => {
    it("should generate the json schema as expected (strict declaration)", () => {
      class Tracking {
        @OneOf(PageView, Action)
        data: PageView | Action;
      }

      expect(getJsonSchema(Tracking)).toEqual({
        definitions: {
          Action: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          PageView: {
            properties: {
              type: {
                const: "page_view",
                examples: ["page_view"],
                type: "string"
              },
              meta: {
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["url"],
            type: "object"
          }
        },
        properties: {
          data: {
            discriminator: {
              propertyName: "type"
            },
            oneOf: [
              {
                $ref: "#/definitions/PageView"
              },
              {
                $ref: "#/definitions/Action"
              }
            ],
            required: ["type"]
          }
        },
        type: "object"
      });
    });
    it("should generate the json schema as expected (strict declaration - array)", () => {
      class Tracking {
        @OneOf(PageView, Action)
        data: (PageView | Action)[];
      }

      expect(getJsonSchema(Tracking)).toEqual({
        definitions: {
          Action: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          PageView: {
            properties: {
              type: {
                const: "page_view",
                examples: ["page_view"],
                type: "string"
              },
              meta: {
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["url"],
            type: "object"
          }
        },
        properties: {
          data: {
            items: {
              discriminator: {
                propertyName: "type"
              },
              oneOf: [
                {
                  $ref: "#/definitions/PageView"
                },
                {
                  $ref: "#/definitions/Action"
                }
              ],
              required: ["type"]
            },
            type: "array"
          }
        },
        type: "object"
      });
    });
    it("should generate the json schema as expected (automatic introspection on children classes)", () => {
      class Tracking {
        @OneOf(Event)
        data: OneOfEvents;
      }

      expect(getJsonSchema(Tracking)).toEqual({
        definitions: {
          Action: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          CustomAction: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                const: "custom_action",
                examples: ["custom_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          PageView: {
            properties: {
              type: {
                const: "page_view",
                examples: ["page_view"],
                type: "string"
              },
              meta: {
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["url"],
            type: "object"
          }
        },
        properties: {
          data: {
            discriminator: {
              propertyName: "type"
            },
            oneOf: [
              {
                $ref: "#/definitions/PageView"
              },
              {
                $ref: "#/definitions/Action"
              },
              {
                $ref: "#/definitions/CustomAction"
              }
            ],
            required: ["type"]
          }
        },
        type: "object"
      });
    });
    it("should generate the json schema as expected (summary json-schema when one of have only one schema)", () => {
      class Tracking {
        @OneOf(Action)
        data: Action;
      }

      expect(getJsonSchema(Tracking)).toEqual({
        definitions: {
          Action: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          }
        },
        properties: {
          data: {
            $ref: "#/definitions/Action"
          }
        },
        type: "object"
      });
    });
    it("should generate the json schema from endpoint", () => {
      @Controller("/")
      class MyTest {
        @Post("/")
        @Returns(200, Array).OneOf(Event)
        post(@BodyParams() @OneOf(Event) events: OneOfEvents[]) {
          return [];
        }
      }

      const metadata = JsonEntityStore.from(MyTest, "post", 0);

      expect(getJsonSchema(metadata)).toEqual({
        definitions: {
          Action: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          CustomAction: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                const: "custom_action",
                examples: ["custom_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["event"],
            type: "object"
          },
          PageView: {
            properties: {
              type: {
                const: "page_view",
                examples: ["page_view"],
                type: "string"
              },
              meta: {
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            required: ["url"],
            type: "object"
          }
        },
        items: {
          discriminator: {
            propertyName: "type"
          },
          oneOf: [
            {
              $ref: "#/definitions/PageView"
            },
            {
              $ref: "#/definitions/Action"
            },
            {
              $ref: "#/definitions/CustomAction"
            }
          ],
          required: ["type"]
        },
        type: "array"
      });
    });
    it("should generate the json schema from endpoint - partial", () => {
      @Controller("/")
      class MyTest {
        @Patch("/")
        @Returns(200, Array).OneOf(Event)
        patch(@BodyParams() @OneOf(Event) @Partial() event: OneOfEvents) {
          return [];
        }
      }

      const metadata = JsonEntityStore.from(MyTest, "patch", 0);

      expect(getJsonSchema(metadata)).toEqual({
        definitions: {
          ActionPartial: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                enum: ["action", "click_action"],
                examples: ["action", "click_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            type: "object"
          },
          CustomActionPartial: {
            properties: {
              event: {
                minLength: 1,
                type: "string"
              },
              meta: {
                type: "string"
              },
              type: {
                const: "custom_action",
                examples: ["custom_action"],
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            type: "object"
          },
          PageViewPartial: {
            properties: {
              meta: {
                type: "string"
              },
              type: {
                const: "page_view",
                examples: ["page_view"],
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              },
              value: {
                type: "string"
              }
            },
            type: "object"
          }
        },
        discriminator: {
          propertyName: "type"
        },
        oneOf: [
          {
            $ref: "#/definitions/PageViewPartial"
          },
          {
            $ref: "#/definitions/ActionPartial"
          },
          {
            $ref: "#/definitions/CustomActionPartial"
          }
        ],
        required: ["type"]
      });
    });
  });
  describe("os3", () => {
    it("should generate the spec (array)", () => {
      @Controller("/")
      class MyTest {
        @Post("/")
        @Returns(200, Array).OneOf(Event)
        post(@BodyParams() @OneOf(Event) @Partial() events: OneOfEvents[]) {
          return [];
        }
      }

      const schema = getSpec(MyTest);

      expect(schema).toMatchSnapshot();
    });
    it("should generate the spec (input one item)", () => {
      @Controller("/")
      class MyTest {
        @Put("/:id")
        @Returns(200).OneOf(Event)
        put(@PathParams(":id") id: string, @BodyParams() @OneOf(Event) event: OneOfEvents) {
          return [];
        }
      }

      expect(getSpec(MyTest)).toEqual({
        components: {
          schemas: {
            Action: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  enum: ["action", "click_action"],
                  example: "action",
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            CustomAction: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  example: "custom_action",
                  enum: [
                    "custom_action"
                  ],
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            PageView: {
              properties: {
                type: {
                  example: "page_view",
                  enum: [
                    "page_view"
                  ],
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                url: {
                  minLength: 1,
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["url"],
              type: "object"
            }
          }
        },
        paths: {
          "/{id}": {
            put: {
              operationId: "myTestPut",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      discriminator: {
                        propertyName: "type",
                        mapping: {
                          action: "#/components/schemas/Action",
                          click_action: "#/components/schemas/Action",
                          custom_action: "#/components/schemas/CustomAction",
                          page_view: "#/components/schemas/PageView"
                        }
                      },
                      oneOf: [
                        {
                          $ref: "#/components/schemas/PageView"
                        },
                        {
                          $ref: "#/components/schemas/Action"
                        },
                        {
                          $ref: "#/components/schemas/CustomAction"
                        }
                      ],
                      required: ["type"]
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
                        discriminator: {
                          propertyName: "type",
                          mapping: {
                            action: "#/components/schemas/Action",
                            click_action: "#/components/schemas/Action",
                            custom_action: "#/components/schemas/CustomAction",
                            page_view: "#/components/schemas/PageView"
                          }
                        },
                        oneOf: [
                          {
                            $ref: "#/components/schemas/PageView"
                          },
                          {
                            $ref: "#/components/schemas/Action"
                          },
                          {
                            $ref: "#/components/schemas/CustomAction"
                          }
                        ],
                        required: ["type"]
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyTest"]
            }
          }
        },
        tags: [
          {
            name: "MyTest"
          }
        ]
      });
    });
    it("should generate the spec (partial - input one item)", () => {
      @Controller("/")
      class MyTest {
        @Put("/:id")
        @Returns(200).OneOf(Event)
        put(@PathParams(":id") id: string, @BodyParams() @Partial() @OneOf(Event) event: OneOfEvents) {
          return [];
        }
      }

      expect(getSpec(MyTest)).toEqual({
        components: {
          schemas: {
            Action: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  enum: ["action", "click_action"],
                  example: "action",
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            ActionPartial: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  enum: ["action", "click_action"],
                  example: "action",
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              type: "object"
            },
            CustomAction: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  example: "custom_action",
                  enum: [
                    "custom_action"
                  ],
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            CustomActionPartial: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  example: "custom_action",
                  enum: [
                    "custom_action"
                  ],
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              type: "object"
            },
            PageView: {
              properties: {
                meta: {
                  type: "string"
                },
                type: {
                  example: "page_view",
                  enum: [
                    "page_view"
                  ],
                  type: "string"
                },
                url: {
                  minLength: 1,
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["url"],
              type: "object"
            },
            PageViewPartial: {
              properties: {
                meta: {
                  type: "string"
                },
                type: {
                  example: "page_view",
                  enum: [
                    "page_view"
                  ],
                  type: "string"
                },
                url: {
                  minLength: 1,
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              type: "object"
            }
          }
        },
        paths: {
          "/{id}": {
            put: {
              operationId: "myTestPut",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      discriminator: {
                        propertyName: "type",
                        mapping: {
                          action: "#/components/schemas/ActionPartial",
                          click_action: "#/components/schemas/ActionPartial",
                          custom_action: "#/components/schemas/CustomActionPartial",
                          page_view: "#/components/schemas/PageViewPartial"
                        }
                      },
                      oneOf: [
                        {
                          $ref: "#/components/schemas/PageViewPartial"
                        },
                        {
                          $ref: "#/components/schemas/ActionPartial"
                        },
                        {
                          $ref: "#/components/schemas/CustomActionPartial"
                        }
                      ],
                      required: ["type"]
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
                        discriminator: {
                          propertyName: "type",
                          mapping: {
                            action: "#/components/schemas/Action",
                            click_action: "#/components/schemas/Action",
                            custom_action: "#/components/schemas/CustomAction",
                            page_view: "#/components/schemas/PageView"
                          }
                        },
                        oneOf: [
                          {
                            $ref: "#/components/schemas/PageView"
                          },
                          {
                            $ref: "#/components/schemas/Action"
                          },
                          {
                            $ref: "#/components/schemas/CustomAction"
                          }
                        ],
                        required: ["type"]
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyTest"]
            }
          }
        },
        tags: [
          {
            name: "MyTest"
          }
        ]
      });
    });
    it("should generate the spec (return one item)", () => {
      @Controller("/")
      class MyTest {
        @Get("/:id")
        @Returns(200).OneOf(Event)
        get(@PathParams(":id") id: string) {
          return [];
        }
      }

      expect(getSpec(MyTest)).toEqual({
        components: {
          schemas: {
            Action: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  enum: ["action", "click_action"],
                  example: "action",
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            CustomAction: {
              properties: {
                event: {
                  minLength: 1,
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                type: {
                  example: "custom_action",
                  enum: [
                    "custom_action"
                  ],
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["event"],
              type: "object"
            },
            PageView: {
              properties: {
                type: {
                  example: "page_view",
                  enum: [
                    "page_view"
                  ],
                  type: "string"
                },
                meta: {
                  type: "string"
                },
                url: {
                  minLength: 1,
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              required: ["url"],
              type: "object"
            }
          }
        },
        paths: {
          "/{id}": {
            get: {
              operationId: "myTestGet",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        discriminator: {
                          propertyName: "type",
                          mapping: {
                            action: "#/components/schemas/Action",
                            click_action: "#/components/schemas/Action",
                            custom_action: "#/components/schemas/CustomAction",
                            page_view: "#/components/schemas/PageView"
                          }
                        },
                        oneOf: [
                          {
                            $ref: "#/components/schemas/PageView"
                          },
                          {
                            $ref: "#/components/schemas/Action"
                          },
                          {
                            $ref: "#/components/schemas/CustomAction"
                          }
                        ],
                        required: ["type"]
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyTest"]
            }
          }
        },
        tags: [
          {
            name: "MyTest"
          }
        ]
      });
    });
    it("should generate the spec (return no item)", () => {
      class Base {
        @DiscriminatorKey() // declare this property a discriminator key
        type: string;

        @Property()
        value: string;
      }

      @Controller("/")
      class MyTest {
        @Get("/:id")
        @Returns(200).OneOf(Base)
        get(@PathParams(":id") id: string) {
          return [];
        }
      }

      expect(getSpec(MyTest)).toEqual({
        components: {
          schemas: {
            Base: {
              properties: {
                type: {
                  type: "string"
                },
                value: {
                  type: "string"
                }
              },
              type: "object"
            }
          }
        },
        paths: {
          "/{id}": {
            get: {
              operationId: "myTestGet",
              parameters: [
                {
                  in: "path",
                  name: "id",
                  required: true,
                  schema: {
                    type: "string"
                  }
                }
              ],
              responses: {
                "200": {
                  content: {
                    "application/json": {
                      schema: {
                        $ref: "#/components/schemas/Base"
                      }
                    }
                  },
                  description: "Success"
                }
              },
              tags: ["MyTest"]
            }
          }
        },
        tags: [
          {
            name: "MyTest"
          }
        ]
      });
    });
  });
  describe("isDiscriminatorChild", () => {
    it("should return true when it's a child discriminator", () => {
      expect(JsonEntityStore.from(CustomAction).isDiscriminatorChild).toEqual(true);
    });
    it("should return false when isn't a child discriminator", () => {
      expect(JsonEntityStore.from(Event).isDiscriminatorChild).toEqual(false);
    });
  });
  describe("with kind property", () => {
    it("should generate the spec", () => {
      enum Discriminator {
        ONE = "one",
        TWO = "two"
      }

      abstract class BaseModel {
        @Enum(Discriminator.ONE, Discriminator.TWO)
        @DiscriminatorKey()
        public type!: Discriminator.ONE | Discriminator.TWO;
      }

      @DiscriminatorValue(Discriminator.ONE)
      class FirstImpl extends BaseModel {
        public declare type: Discriminator.ONE;

        @Enum("json")
        public kind!: "json";
      }

      @DiscriminatorValue(Discriminator.TWO)
      class SecondImpl extends BaseModel {
        public declare type: Discriminator.TWO;

        @Property()
        public prop!: string;
      }

      class ParentModel {
        @OneOf(FirstImpl, SecondImpl)
        public test?: FirstImpl | SecondImpl;
      }

      @Controller("/test")
      @Name("Test")
      class TestController {
        @Get()
        @Returns(200, Array).Of(ParentModel)
        public get(): Promise<ParentModel> {
          return null as any;
        }
      }

      expect(getSpec(TestController)).toMatchSnapshot();
    });
  });
});
