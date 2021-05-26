import {Store} from "@tsed/core";
import {deserialize, serialize} from "@tsed/json-mapper/src";
import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Types, Schema} from "mongoose";
import sinon from "sinon";
import {MONGOOSE_SCHEMA} from "../constants";
import {NumberDecimal, Decimal128, DecimalFormat} from "./numberDecimal";

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

    expect(schema).to.deep.eq({
      properties: {
        price: {
          examples: [12.34],
          type: "number",
          format: "decimal"
        }
      },
      type: "object"
    });

    expect(store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      type: Schema.Types.Decimal128
    });
  });
  it("should declare a decimal number format", () => {
    // WHEN
    const format = new DecimalFormat();
    const validate: (value: any) => boolean = format.validate;

    // THEN
    const store = Store.from(DecimalFormat);

    expect(store.get("ajv:formats")).to.deep.eq({
      name: "decimal",
      options: {
        type: "number"
      }
    });

    expect(validate(undefined)).to.be.false;
    expect(validate(null)).to.be.false;
    expect(validate([])).to.be.false;
    expect(validate({})).to.be.false;
    expect(validate("0.0")).to.be.true;
    expect(validate(NaN)).to.be.true;
    expect(validate(0)).to.be.true;
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

    expect(result).to.be.instanceOf(Model);
    expect(result).to.deep.eq({
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

    expect(result).to.be.instanceOf(Model);
    expect(result).to.deep.eq({
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

    expect(result).to.deep.eq({
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

    expect(result).to.not.have.property("price");
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
    sinon.stub(obj, "Decimal").returns(fakePrice);

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

    expect(obj.Decimal).to.have.been.calledWithExactly("1234.56");

    expect(result).to.be.instanceOf(Model);
    expect(result).to.deep.eq({
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

    expect(result).to.deep.eq({
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
    sinon.stub(obj, "Decimal").returns(fakePrice);

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

    expect(schema.get).to.be.a("function");
    expect(schema.get(testDecimal)).to.be.eq(fakePrice);
    expect(obj.Decimal).to.have.been.calledWithExactly(testDecimal);
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
    sinon.stub(obj, "Decimal").returns(fakePrice);

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

    expect(schema.get).to.be.a("function");
    expect(schema.get(fakePrice)).to.be.eq(fakePrice);
    expect(obj.Decimal).to.have.not.been.called;
  });
});
