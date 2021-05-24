import {descriptorOf, Store} from "@tsed/core";
import {deserialize, serialize} from "@tsed/json-mapper/src";
import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Types, Schema} from "mongoose";
import sinon from "sinon";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants";
import {NumberDecimal, Decimal128} from "./numberDecimal";

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
  it("should deserialize a number value using custom constructor", () => {
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
  it("should serialize a number value using custom constructor", () => {
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
});
