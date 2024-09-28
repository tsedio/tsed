import {CollectionOf, getJsonSchema, Property, string} from "../../index.js";
import {GenericOf} from "./genericOf.js";
import {Generics} from "./generics.js";

describe("@GenericOf", () => {
  it("should generate Generic pagination with nested model (array)", () => {
    @Generics("T")
    class Paginated<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @GenericOf(Product)
      submissions: Paginated<Product>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submissions: {
          properties: {
            data: {
              items: {
                $ref: "#/definitions/Product"
              },
              type: "array"
            },
            totalCount: {
              type: "number"
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic pagination with nested model", () => {
    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @GenericOf(Product)
      submission: Submission<Product>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              $ref: "#/definitions/Product"
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic pagination with nested model (deep generics)", () => {
    @Generics("T")
    class Paginated<T> {
      @CollectionOf("T")
      data: T[];

      @Property()
      totalCount: number;
    }

    @Generics("S")
    class Submission<S> {
      @Property()
      _id: string;

      @Property("S")
      data: S;
    }

    class Product {
      @Property()
      label: string;
    }

    class Content {
      @(GenericOf(Submission).Nested(Product))
      submissions: Paginated<Submission<Product>>;
    }

    expect(getJsonSchema(Content)).toEqual({
      definitions: {
        Product: {
          properties: {
            label: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        submissions: {
          properties: {
            data: {
              items: {
                properties: {
                  _id: {
                    type: "string"
                  },
                  data: {
                    $ref: "#/definitions/Product"
                  }
                },
                type: "object"
              },
              type: "array"
            },
            totalCount: {
              type: "number"
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic with an enum", () => {
    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    enum MyEnum {
      READ = "read",
      WRITE = "write"
    }

    class Content {
      @GenericOf(MyEnum)
      submission: Submission<MyEnum>;
    }

    expect(getJsonSchema(Content)).toEqual({
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              type: "string",
              enum: ["read", "write"]
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should generate Generic with raw json schema", () => {
    @Generics("T")
    class Submission<T> {
      @Property()
      _id: string;

      @Property("T")
      data: T;
    }

    enum MyEnum {
      READ = "read",
      WRITE = "write"
    }

    class Content {
      @GenericOf(string().enum(["read", "write"]))
      submission: Submission<MyEnum>;
    }

    expect(getJsonSchema(Content)).toEqual({
      properties: {
        submission: {
          properties: {
            _id: {
              type: "string"
            },
            data: {
              type: "string",
              enum: ["read", "write"]
            }
          },
          type: "object"
        }
      },
      type: "object"
    });
  });
});
