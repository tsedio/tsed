import {isString, StoreMerge, useDecorators} from "@tsed/core";
import {OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {Description, Example, Name, Format, JsonEntityFn, string, number, Property} from "@tsed/schema";
import {Types, Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";

import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes";
import {MongooseModels} from "../registries/MongooseModels";

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
  return useDecorators(
    Property(Number),
    Format("decimal"),
    Example(12.34),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types.Decimal128
    }),
    OnDeserialize((value) => {
      if (type) {
        return new type(value);
      }
      if (isString(value)) {
        return Types.Decimal128.fromString(value);
      }
      return Types.Decimal128.fromString(`${value}`);
    }),
    OnSerialize((value: any, ctx) => {
      return Number(value);
    })
  );
}

export type Decimal128 = Types.Decimal128;
