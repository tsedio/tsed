import {Controller} from "@tsed/di";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {
  DiscriminatorKey,
  DiscriminatorValue,
  Get,
  getJsonSchema,
  getSpec,
  JsonEntityStore,
  OneOf,
  Post,
  Property,
  Put,
  Required,
  Returns
} from "@tsed/schema";

class Event {
  @DiscriminatorKey() // declare this property a discriminator key
  type: string;

  @Property()
  value: string;
}

class SubEvent extends Event {
  @Property()
  meta: string;
}

@DiscriminatorValue("page_view") // or @DiscriminatorValue() value can be inferred by the class name
class PageView extends SubEvent {
  @Required()
  url: string;
}

@DiscriminatorValue("action", "click_action")
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
  });
  describe("os3", () => {
    it("should generate the spec (array)", () => {
      @Controller("/")
      class MyTest {
        @Post("/")
        @Returns(200, Array).OneOf(Event)
        post(@BodyParams() @OneOf(Event) events: OneOfEvents[]) {
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
          "/": {
            post: {
              operationId: "myTestPost",
              parameters: [],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      items: {
                        discriminator: {
                          propertyName: "type"
                        },
                        nullable: true,
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
                      },
                      type: "array"
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
                        items: {
                          discriminator: {
                            propertyName: "type"
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
                        },
                        type: "array"
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
                        propertyName: "type"
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
                    "*/*": {
                      schema: {
                        discriminator: {
                          propertyName: "type"
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
                    "*/*": {
                      schema: {
                        discriminator: {
                          propertyName: "type"
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
  });
  describe("isDiscriminatorChild", () => {
    it("should return true when it's a child discriminator", () => {
      expect(JsonEntityStore.from(CustomAction).isDiscriminatorChild).toEqual(true);
    });
    it("should return false when isn't a child discriminator", () => {
      expect(JsonEntityStore.from(Event).isDiscriminatorChild).toEqual(false);
    });
  });
});
