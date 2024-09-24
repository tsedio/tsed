import {Store} from "@tsed/core";
import {deserialize, serialize} from "@tsed/json-mapper";
import {getJsonSchema} from "@tsed/schema";
import {Schema, Types} from "mongoose";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {Decimal128, DecimalFormat, NumberDecimal} from "./numberDecimal.js";

describe("@NumberDecimal()", () => {
  it("should declare a Decimal128 field", () => {
    // WHEN
    class Test {
      @NumberDecimal()
      price: Decimal128;
    }

    // THEN
    const store = Store.from(Test, "price");
    const schema = getJsonSchema(Test);

    expect(schema).toEqual({
      properties: {
        price: {
          examples: [12.34],
          type: "number",
          format: "decimal"
        }
      },
      type: "object"
    });

    expect(store.get(MONGOOSE_SCHEMA)).toEqual({
      type: Schema.Types.Decimal128
    });
  });
  it("should declare a decimal number format", () => {
    // WHEN
    const format = new DecimalFormat();
    const validate: (value: any) => boolean = format.validate;

    // THEN
    const store = Store.from(DecimalFormat);

    expect(store.get("ajv:formats")).toEqual({
      name: "decimal",
      options: {
        type: "number"
      }
    });

    expect(validate(undefined)).toBe(false);
    expect(validate(null)).toBe(false);
    expect(validate([])).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate("0.0")).toBe(true);
    expect(validate(NaN)).toBe(true);
    expect(validate(0)).toBe(true);
  });
  it("should deserialize a number value", () => {
    // WHEN
    class Model {
      @NumberDecimal()
      price: Decimal128;
    }

    // THEN
    const result = deserialize(
      {
        price: 1234.56
      },
      {type: Model, additionalProperties: false}
    );

    expect(result).toBeInstanceOf(Model);
    expect(result).toEqual({
      price: Types.Decimal128.fromString("1234.56")
    });
  });
  it("should deserialize a string value", () => {
    // WHEN
    class Model {
      @NumberDecimal()
      price: Decimal128;
    }

    // THEN
    const result = deserialize(
      {
        price: "1234.56"
      },
      {type: Model, additionalProperties: false}
    );

    expect(result).toBeInstanceOf(Model);
    expect(result).toEqual({
      price: Types.Decimal128.fromString("1234.56")
    });
  });
  it("should serialize a number value", () => {
    // WHEN
    class Model {
      @NumberDecimal()
      price: Decimal128;
    }

    const mdl = new Model();
    mdl.price = Types.Decimal128.fromString("1234.56");

    // THEN
    const result = serialize(mdl);

    expect(result).toEqual({
      price: 1234.56
    });
  });
  it("should serialize an undefined value", () => {
    // WHEN
    class Model {
      @NumberDecimal()
      price?: Decimal128;
    }

    const mdl = new Model();

    // THEN
    const result = serialize(mdl);

    expect(result).not.toHaveProperty("price");
  });
  it("should deserialize an undefined value", () => {
    // WHEN
    class Model {
      @NumberDecimal()
      price?: Decimal128;
    }

    // THEN
    const result = deserialize({}, {type: Model, additionalProperties: false});

    expect(result).toBeInstanceOf(Model);
    expect(result.price).toEqual(undefined);
  });
  it("should deserialize a number value using custom decimal", () => {
    // GIVEN
    class Decimal {
      constructor(private value: any) {}
      toString() {
        return `${this.value}`;
      }
    }

    const fakePrice = new Decimal("1234.56");

    const obj = {Decimal};
    vi.spyOn(obj, "Decimal").mockReturnValue(fakePrice);

    // WHEN
    class Model {
      @NumberDecimal(obj.Decimal)
      price: Decimal;
    }

    // THEN
    const result = deserialize(
      {
        price: "1234.56"
      },
      {type: Model, additionalProperties: false}
    );

    expect(obj.Decimal).toHaveBeenCalledWith("1234.56");

    expect(result).toBeInstanceOf(Model);
    expect(result).toEqual({
      price: fakePrice
    });
  });
  it("should serialize a number value using custom decimal", () => {
    // GIVEN
    class Decimal {
      constructor(private value: any) {}
      toString() {
        return `${this.value}`;
      }
    }

    // WHEN
    class Model {
      @NumberDecimal(Decimal)
      price: Decimal;
    }

    const mdl = new Model();
    mdl.price = new Decimal("1234.56");

    // THEN
    const result = serialize(mdl);

    expect(result).toEqual({
      price: 1234.56
    });
  });
  it("should convert Decimal128 to custom implementation", () => {
    // GIVEN
    class Decimal {
      constructor(private value: any) {}
      toString() {
        return `${this.value}`;
      }
    }

    const testDecimal = Types.Decimal128.fromString("1234.56");
    const fakePrice = new Decimal("1234.56");

    const obj = {Decimal};
    vi.spyOn(obj, "Decimal").mockReturnValue(fakePrice);

    // WHEN
    class Model {
      @NumberDecimal(obj.Decimal)
      price: Decimal;
    }

    const mdl = new Model();
    mdl.price = new Decimal("1234.56");

    // THEN
    const store = Store.from(Model, "price");
    const schema = store.get(MONGOOSE_SCHEMA);

    expect(schema.get).toBeInstanceOf(Function);
    expect(schema.get(testDecimal)).toBe(fakePrice);
    expect(obj.Decimal).toHaveBeenCalledWith(testDecimal);
  });
  it("should not convert custom decimal again", () => {
    // GIVEN
    class Decimal {
      constructor(private value: any) {}
      toString() {
        return `${this.value}`;
      }
    }

    const fakePrice = new Decimal("1234.56");

    const obj = {Decimal};
    vi.spyOn(obj, "Decimal").mockReturnValue(fakePrice);

    // WHEN
    class Model {
      @NumberDecimal(obj.Decimal)
      price: Decimal;
    }

    const mdl = new Model();
    mdl.price = new Decimal("1234.56");

    // THEN
    const store = Store.from(Model, "price");
    const schema = store.get(MONGOOSE_SCHEMA);

    expect(schema.get).toBeInstanceOf(Function);
    expect(schema.get(fakePrice)).toBe(fakePrice);
    expect(obj.Decimal).not.toHaveBeenCalled();
  });
});
