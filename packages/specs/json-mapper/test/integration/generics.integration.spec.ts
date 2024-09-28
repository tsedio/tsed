import {Controller} from "@tsed/di";
import {
  boolean,
  CollectionOf,
  date,
  ForwardGroups,
  GenericOf,
  Generics,
  Get,
  Ignore,
  Integer,
  JsonEntityStore,
  number,
  Property,
  Required,
  Returns,
  string
} from "@tsed/schema";
import {describe, expect, it} from "vitest";

import {deserialize} from "../../src/utils/deserialize.js";
import {serialize} from "../../src/utils/serialize.js";

describe("Generics", () => {
  describe("using Functional api", () => {
    it("should transform string from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(string())
        adjustment: UserProperty<string>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: "2019-01-01T12:45:57.111Z"
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: "2019-01-01T12:45:57.111Z"
        }
      });
    });
    it("should transform number from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(number())
        adjustment: UserProperty<number>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: 10
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: 10
        }
      });
    });
    it("should transform model with given generic explicitly", () => {
      @Generics("T")
      class Envelope<T> {
        @CollectionOf("T")
        @ForwardGroups()
        data: T[];
      }

      class Match {
        @Integer()
        id: number;
      }

      const result = deserialize(
        {
          data: [{id: 1}, {id: 2}]
        },
        {type: Envelope, generics: [[Match]]}
      );

      expect(result).toEqual({
        data: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      });
      expect(result.data[0]).toBeInstanceOf(Match);
    });
    it("should transform boolean from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(boolean())
        adjustment: UserProperty<Date>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: false
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: false
        }
      });
    });
    it("should transform date from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(date().format("date-time"))
        adjustment: UserProperty<Date>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: "2019-01-01T12:45:57.111Z"
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toMatchSnapshot();
    });
  });
  describe("using type", () => {
    it("should transform string from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(String)
        adjustment: UserProperty<string>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: "2019-01-01T12:45:57.111Z"
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: "2019-01-01T12:45:57.111Z"
        }
      });
    });
    it("should transform number from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(Number)
        adjustment: UserProperty<number>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: 10
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: 10
        }
      });
    });
    it("should transform boolean from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(Boolean)
        adjustment: UserProperty<Date>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: false
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: false
        }
      });
    });
    it("should transform date from generic object", () => {
      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(Date)
        adjustment: UserProperty<Date>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: "2019-01-01T12:45:57.111Z"
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: new Date("2019-01-01T12:45:57.111Z")
        }
      });
    });
    it("should generate JsonSchema with 'enum' from generic object", () => {
      enum AdjustmentType {
        PRICE = "price",
        DELAY = "delay"
      }

      @Generics("T")
      class UserProperty<T> {
        @Property("T")
        value: T;
      }

      class Adjustment {
        @GenericOf(AdjustmentType)
        adjustment: UserProperty<AdjustmentType>;
      }

      let result = deserialize(
        {
          adjustment: {
            value: "delay"
          }
        },
        {
          type: Adjustment
        }
      );

      expect(result).toEqual({
        adjustment: {
          value: "delay"
        }
      });
    });
  });

  describe("Pagination", () => {
    it("should serialize correctly the return object from controller (generic array)", () => {
      @Generics("T")
      class Pagination<T> {
        @CollectionOf("T")
        @Required()
        items: T[];

        @Required()
        totalCount: number;

        constructor(partial: Partial<Pagination<T>>) {
          Object.assign(this, partial);
        }
      }

      class TestEntity {
        @Property("id")
        public _id: string;

        @Property()
        name: string;

        @Property()
        @Ignore()
        secret: string;
      }

      @Controller("/hello-world")
      class HelloWorldController {
        constructor() {}

        @Get("/")
        @(Returns(200, Pagination).Of(TestEntity))
        get() {}
      }

      const endpoint = JsonEntityStore.fromMethod(HelloWorldController, "get");

      const responseOpts = endpoint.getResponseOptions(200, {});

      const item = new TestEntity();
      item._id = "64f05e452ecc156cff3b58f4";
      item.name = "Test";
      item.secret = "top";

      const paginated = new Pagination({items: [item], totalCount: 1});

      const result = serialize(paginated, {
        useAlias: true,
        additionalProperties: false,
        ...responseOpts,
        endpoint: true
      });

      expect(result).toEqual({
        items: [
          {
            _id: "64f05e452ecc156cff3b58f4",
            name: "Test"
          }
        ],
        totalCount: 1
      });
    });
    it("should serialize correctly the return object from controller (generic item)", () => {
      @Generics("T")
      class Pagination<T> {
        @Property("T")
        @Required()
        item: T;

        @Required()
        totalCount: number;

        constructor(partial: Partial<Pagination<T>>) {
          Object.assign(this, partial);
        }
      }

      class TestEntity {
        @Property("id")
        public _id: string;

        @Property()
        name: string;

        @Property()
        @Ignore()
        secret: string;
      }

      @Controller("/hello-world")
      class HelloWorldController {
        constructor() {}

        @Get("/")
        @(Returns(200, Pagination).Of(TestEntity))
        get() {}
      }

      const endpoint = JsonEntityStore.fromMethod(HelloWorldController, "get");

      const responseOpts = endpoint.getResponseOptions(200, {});

      const item = new TestEntity();
      item._id = "64f05e452ecc156cff3b58f4";
      item.name = "Test";
      item.secret = "top";

      const paginated = new Pagination({item: item, totalCount: 1});

      const result = serialize(paginated, {
        useAlias: true,
        additionalProperties: false,
        ...responseOpts,
        endpoint: true
      });

      expect(result).toEqual({
        item: {
          _id: "64f05e452ecc156cff3b58f4",
          name: "Test"
        },
        totalCount: 1
      });
    });
  });
});
