import {CollectionOf, Email, GenericOf, Generics, getJsonSchema, JsonSchemaStore, MinLength, Name, Property, Required} from "@tsed/schema";
import {expect} from "chai";
import {Post} from "../../test/helpers/Post";

describe("getJsonSchema", () => {
  it("should declare all schema correctly (basic)", () => {
    // WHEN
    class Model {
      @Property()
      @Required()
      prop1: string;

      @CollectionOf(String)
      prop2: string[];

      @CollectionOf(String)
      prop3: Set<string>;

      @CollectionOf(String)
      prop4: Map<string, string>;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      required: ["prop1"],
      properties: {
        prop1: {
          minLength: 1,
          type: "string"
        },
        prop2: {
          type: "array",
          items: {
            type: "string"
          }
        },
        prop3: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "string"
          }
        },
        prop4: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        }
      }
    });
  });
  it("should declare all schema correctly (alias)", () => {
    // WHEN
    class Model {
      @Name("prop_1")
      @Required()
      prop1: string;
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      type: "object",
      required: ["prop_1"],
      properties: {
        prop_1: {
          minLength: 1,
          type: "string"
        }
      }
    });
  });
  it("should declare prop with a nested model", () => {
    // WHEN
    class NestedModel {
      @Property()
      id: string;

      @Property()
      prop1: string;
    }

    class Model {
      @Property()
      id: string;

      @Property()
      nested: NestedModel;
    }

    // THEN

    expect(getJsonSchema(NestedModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          type: "string"
        }
      }
    });

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        nested: {
          $ref: "#/definitions/NestedModel"
        }
      },
      definitions: {
        NestedModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });
  });
  it("should declare prop with a nested model with named model", () => {
    // WHEN
    @Name("Nested")
    class NestedModel {
      @Property()
      id: string;

      @Property()
      prop1: string;
    }

    class Model {
      @Property()
      id: string;

      @Property()
      nested: NestedModel;
    }

    // THEN
    expect(getJsonSchema(NestedModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          type: "string"
        }
      }
    });

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        nested: {
          $ref: "#/definitions/Nested"
        }
      },
      definitions: {
        Nested: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });
  });
  it("should declare prop with a nested of nested model (Array)", () => {
    // WHEN
    class ChildModel {
      @Property()
      id: string;

      @Property()
      prop1: string;
    }

    class NestedModel {
      @Property()
      id: string;

      @CollectionOf(ChildModel)
      children: ChildModel[];
    }

    class Model {
      @Property()
      id: string;

      @Property()
      nested: NestedModel;
    }

    // THEN
    expect(getJsonSchema(ChildModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          type: "string"
        }
      }
    });

    expect(getJsonSchema(NestedModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        children: {
          type: "array",
          items: {
            $ref: "#/definitions/ChildModel"
          }
        }
      },
      definitions: {
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        nested: {
          $ref: "#/definitions/NestedModel"
        }
      },
      definitions: {
        NestedModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            children: {
              type: "array",
              items: {
                $ref: "#/definitions/ChildModel"
              }
            }
          }
        },
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });
  });
  it("should declare prop with a nested of nested model (Set)", () => {
    // WHEN
    class ChildModel {
      @Property()
      id: string;

      @Property()
      prop1: string;
    }

    class NestedModel {
      @Property()
      id: string;

      @CollectionOf(ChildModel)
      children: Set<ChildModel>;
    }

    class Model {
      @Property()
      id: string;

      @Property()
      nested: NestedModel;
    }

    // THEN
    expect(getJsonSchema(ChildModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          type: "string"
        }
      }
    });

    expect(getJsonSchema(NestedModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        children: {
          type: "array",
          uniqueItems: true,
          items: {
            $ref: "#/definitions/ChildModel"
          }
        }
      },
      definitions: {
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        nested: {
          $ref: "#/definitions/NestedModel"
        }
      },
      definitions: {
        NestedModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            children: {
              type: "array",
              uniqueItems: true,
              items: {
                $ref: "#/definitions/ChildModel"
              }
            }
          }
        },
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });
  });
  it("should declare prop with a nested of nested model (Map)", () => {
    // WHEN
    class ChildModel {
      @Property()
      id: string;

      @Property()
      prop1: string;
    }

    class NestedModel {
      @Property()
      id: string;

      @CollectionOf(ChildModel)
      children: Map<string, ChildModel>;
    }

    class Model {
      @Property()
      id: string;

      @Property()
      nested: NestedModel;
    }

    // THEN
    expect(getJsonSchema(ChildModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        prop1: {
          type: "string"
        }
      }
    });

    expect(getJsonSchema(NestedModel)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        children: {
          type: "object",
          additionalProperties: {
            $ref: "#/definitions/ChildModel"
          }
        }
      },
      definitions: {
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        nested: {
          $ref: "#/definitions/NestedModel"
        }
      },
      definitions: {
        NestedModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            children: {
              type: "object",
              additionalProperties: {
                $ref: "#/definitions/ChildModel"
              }
            }
          }
        },
        ChildModel: {
          type: "object",
          properties: {
            id: {
              type: "string"
            },
            prop1: {
              type: "string"
            }
          }
        }
      }
    });
  });
  it("should accept circular ref", () => {
    // WHEN

    // THEN
    const classSchema = getJsonSchema(Post);

    expect(classSchema).to.deep.equal({
      definitions: {
        Post: {
          properties: {
            id: {
              type: "string"
            },
            owner: {
              $ref: "#/definitions/User"
            }
          },
          type: "object"
        },
        User: {
          properties: {
            name: {
              type: "string"
            },
            posts: {
              items: {
                $ref: "#/definitions/Post"
              },
              type: "array"
            }
          },
          type: "object"
        }
      },
      properties: {
        id: {
          type: "string"
        },
        owner: {
          $ref: "#/definitions/User"
        }
      },
      type: "object"
    });
  });
  it("should return the json schema for an inherited model", () => {
    class Base {
      @Property()
      id: string;

      @Required()
      @Email()
      email: string;
    }

    class Model extends Base {
      @MinLength(0)
      email: string;

      @Property()
      name: string;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      type: "object",
      properties: {
        id: {
          type: "string"
        },
        email: {
          type: "string",
          minLength: 0,
          format: "email"
        },
        name: {
          type: "string"
        }
      },
      required: ["email"]
    });
  });
  it("should return the json schema for an inherited model and generics", () => {
    @Generics("T")
    class Base<T> {
      @Property()
      id: string;

      @Required()
      @Email()
      email: string;

      @Property("T")
      role: T;
    }

    class Model<T> extends Base<T> {
      @MinLength(0)
      email: string;

      @Property()
      name: string;
    }

    class Role {
      @Property()
      level: string;
    }

    class Content {
      @GenericOf(Role)
      payload: Model<Role>;
    }

    expect(getJsonSchema(Content)).to.deep.eq({
      definitions: {
        Role: {
          properties: {
            level: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        payload: {
          properties: {
            email: {
              format: "email",
              minLength: 0,
              type: "string"
            },
            id: {
              type: "string"
            },
            name: {
              type: "string"
            },
            role: {
              $ref: "#/definitions/Role"
            }
          },
          required: ["email"],
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should return the json schema with hosted schemes", () => {
    @Generics("T")
    class Base<T> {
      @Property()
      id: string;

      @Required()
      @Email()
      email: string;

      @Property("T")
      role: T;
    }

    class Model<T> extends Base<T> {
      @MinLength(0)
      email: string;

      @Property()
      name: string;
    }

    class Role {
      @Property()
      level: string;
    }

    class Content {
      @GenericOf(Role)
      payload: Model<Role>;
    }

    expect(getJsonSchema(Content, {host: "http://example.com/schema"})).to.deep.eq({
      definitions: {
        Role: {
          properties: {
            level: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        payload: {
          properties: {
            email: {
              format: "email",
              minLength: 0,
              type: "string"
            },
            id: {
              type: "string"
            },
            name: {
              type: "string"
            },
            role: {
              $ref: "http://example.com/schema/Role"
            }
          },
          required: ["email"],
          type: "object"
        }
      },
      type: "object"
    });
  });
});
