import {CollectionOf, getJsonSchema, Property} from "@tsed/schema";
import {expect} from "chai";
import {GenericOf} from "./genericOf";
import {Generics} from "./generics";

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

    expect(getJsonSchema(Content)).to.deep.eq({
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

    expect(getJsonSchema(Content)).to.deep.eq({
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

    expect(getJsonSchema(Content)).to.deep.eq({
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
});
