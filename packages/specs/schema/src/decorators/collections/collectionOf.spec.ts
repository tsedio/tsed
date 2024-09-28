import {catchError} from "@tsed/core";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {array, map, string} from "../../utils/from.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {Property} from "../common/property.js";
import {Schema} from "../common/schema.js";
import {In} from "../operations/in.js";
import {OperationPath} from "../operations/operationPath.js";
import {CollectionContains} from "./collectionContains.js";
import {ArrayOf, CollectionOf, MapOf} from "./collectionOf.js";
import {MaxItems} from "./maxItems.js";
import {MinItems} from "./minItems.js";

describe("@CollectionOf", () => {
  it("should declare a collection and catch error (Array of)", () => {
    // WHEN
    const error = catchError(() => {
      class Model {
        @CollectionOf(undefined)
        num: number[];
      }
    });

    expect(error?.message).toEqual(
      "A type is required on `@CollectionOf(type)` decorator. Please give a type or wrap it inside an arrow function if you have a circular reference."
    );
  });
  it("should declare an array of map of string", () => {
    const schema = array().items(map().additionalProperties(string()));

    class Test {
      @Schema(schema)
      @CollectionOf(Map)
      fields: Map<string, string>[] = [];
    }

    expect(getJsonSchema(Test)).toEqual({
      properties: {
        fields: {
          items: {
            additionalProperties: {
              type: "string"
            },
            type: "object"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should declare a collection (Array of)", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          items: {
            type: "number"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should declare a collection (Array of Model)", () => {
    // WHEN
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @MaxItems(10)
      @CollectionOf(Nested)
      @MinItems(1)
      prop: Nested[];
    }

    // THEN
    const entity = JsonEntityStore.from(Model, "prop");
    const schema = getJsonSchema(Model);

    expect(entity.schema.getTarget()).toEqual(Array);
    expect(entity.schema.get("type")).toEqual("array");
    expect(entity.itemSchema.getComputedType()).toEqual(Nested);

    expect(schema).toEqual({
      definitions: {
        Nested: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      properties: {
        prop: {
          items: {
            $ref: "#/definitions/Nested"
          },
          minItems: 1,
          maxItems: 10,
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should declare a collection (Array of Model on param)", () => {
    // WHEN
    class Nested {
      @Property()
      id: string;
    }

    class Model {
      @Property()
      id: string;
      @CollectionOf(Nested)
      prop: Nested;
    }

    class Ctrl {
      @OperationPath("POST", "/")
      test(@In("body") @CollectionOf(Model) body: Model[]) {}
    }

    // THEN
    const entity = JsonEntityStore.from(Ctrl.prototype, "test", 0);

    expect(getJsonSchema(entity)).toEqual({
      definitions: {
        Model: {
          properties: {
            id: {
              type: "string"
            },
            prop: {
              $ref: "#/definitions/Nested"
            }
          },
          type: "object"
        },
        Nested: {
          properties: {
            id: {
              type: "string"
            }
          },
          type: "object"
        }
      },
      items: {
        $ref: "#/definitions/Model"
      },
      type: "array"
    });
  });
  it("should declare a collection (Map of)", () => {
    // WHEN
    class Model {
      @(CollectionOf(Number).MinProperties(2).MaxProperties(5))
      num: Map<string, number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          additionalProperties: {
            type: "number"
          },
          maxProperties: 5,
          minProperties: 2,
          type: "object"
        }
      },
      type: "object"
    });
  });
  it("should declare a collection (Set of)", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      num: Set<number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          items: {
            type: "number"
          },
          type: "array",
          uniqueItems: true
        }
      },
      type: "object"
    });
  });
  it("should declare collection with additional props", () => {
    // WHEN
    class Model {
      @(CollectionOf(String).MinItems(0).MaxItems(10).UniqueItems())
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        words: {
          type: "array",
          items: {
            type: "string"
          },
          maxItems: 10,
          minItems: 0,
          uniqueItems: true
        }
      },
      type: "object"
    });
  });
  it("should declare collection with additional props and contains", () => {
    // WHEN
    class Model {
      @(CollectionContains(String).MinItems(0).MaxItems(10))
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        words: {
          type: "array",
          contains: {
            type: "string"
          },
          maxItems: 10,
          minItems: 0
        }
      },
      type: "object"
    });
  });
});

describe("@ArrayOf", () => {
  interface ArrayList<T> extends Array<T> {
    pull(query: any): this;
  }

  it("should declare a collection (Array of)", () => {
    // WHEN
    class Model {
      @ArrayOf(Number)
      num: ArrayList<number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          items: {
            type: "number"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
});

describe("@MapOf", () => {
  interface MapCollection<K, V> extends Map<K, V> {
    take(query: any): V;
  }

  it("should declare a collection (Map of)", () => {
    // WHEN
    class Model {
      @(MapOf(Number).MinProperties(2).MaxProperties(5))
      num: MapCollection<string, number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        num: {
          additionalProperties: {
            type: "number"
          },
          maxProperties: 5,
          minProperties: 2,
          type: "object"
        }
      },
      type: "object"
    });
  });
});
