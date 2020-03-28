import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {CollectionContains} from "./collectionContains";
import {ArrayOf, CollectionOf, MapOf} from "./collectionOf";

describe("@CollectionOf", () => {
  it("should declare a collection (Array of)", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
  it("should declare a collection (Map of)", () => {
    // WHEN
    class Model {
      @(CollectionOf(Number)
        .MinProperties(2)
        .MaxProperties(5))
      num: Map<string, number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
      @(CollectionOf(String)
        .MinItems(0)
        .MaxItems(10)
        .UniqueItems())
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
      @(CollectionContains(String)
        .MinItems(0)
        .MaxItems(10))
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
      @(MapOf(Number)
        .MinProperties(2)
        .MaxProperties(5))
      num: MapCollection<string, number>;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
