import {isBoolean} from "@tsed/core";

import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";

/**
 * Mapper for `Date` type.
 * @jsonmapper
 * @component
 */
@JsonMapper(Date)
export class DateMapper implements JsonMapperMethods {
  deserialize(data: string | number): Date;
  deserialize(data: boolean | null | undefined): boolean | null | undefined;
  deserialize(data: any): any {
    // don't convert unexpected data. In normal case, Ajv reject unexpected data.
    // But by default, we have to skip data deserialization and let user to apply
    // the right mapping
    if (isBoolean(data) || data === null || data === undefined) {
      return data;
    }

    return new Date(data);
  }

  serialize(object: Date): any {
    return object ? new Date(object).toISOString() : object;
  }
}
