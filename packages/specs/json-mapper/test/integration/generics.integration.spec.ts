import {boolean, date, GenericOf, Generics, number, Property, string} from "@tsed/schema";
import {deserialize} from "../../src/utils/deserialize";

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
});
