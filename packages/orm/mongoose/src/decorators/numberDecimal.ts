import {Formats, FormatsMethods} from "@tsed/ajv";
import {isNumber, isString, StoreMerge, useDecorators} from "@tsed/core";
import {OnDeserialize, OnSerialize} from "@tsed/json-mapper";
import {Example, Format, Property} from "@tsed/schema";
import {Schema as MongooseSchema, SchemaTypeOptions, Types} from "mongoose";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";

@Formats("decimal", {type: "number"})
export class DecimalFormat implements FormatsMethods<string | number> {
  validate(num: string | number): boolean {
    return isString(num) || isNumber(num);
  }
}

function isDecimal(value: undefined | number | any) {
  return value && value._bsontype === "Decimal128";
}

/**
 * Tell Mongoose whether to define an Decimal128 property.
 * Will be serialized as `number` with format as `decimal`.
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class PriceModel {
 *   @NumberDecimal()
 *   price: Decimal128;
 * }
 * ```
 * Optionally using custom decimal type, such as `Big` from big.js
 * ```typescript
 * @Model()
 * export class PriceModel {
 *   @NumberDecimal(Big)
 *   price: Big;
 * }
 * ```
 * @param type Optional decimal type constructor
 * @decorator
 * @mongoose
 * @schema
 */
export function NumberDecimal(type?: any) {
  const schema: SchemaTypeOptions<Decimal128> = {
    type: MongooseSchema.Types.Decimal128
  };

  if (type) {
    // Define property getter to convert Decimal128 to custom type
    schema.get = (value) => {
      return isDecimal(value) ? new type(value) : value;
    };
  }

  return useDecorators(
    Property(Number),
    Format("decimal"),
    Example(12.34),
    StoreMerge(MONGOOSE_SCHEMA, schema),

    // Deserialize number value from JSON to Decimal128
    OnDeserialize((value) => {
      if (value === undefined) {
        return undefined;
      }
      if (type) {
        return new type(value);
      }
      if (isString(value)) {
        return Types.Decimal128.fromString(value);
      }
      return Types.Decimal128.fromString(`${value}`);
    }),

    // Serialize decimal value to floating point number
    OnSerialize((value: any, ctx) => {
      return value && Number(value);
    })
  );
}

export type Decimal128 = Types.Decimal128;
