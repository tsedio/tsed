import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {isBoolean} from "@tsed/core";

const {toISOString, getUTCFullYear, getUTCMonth, getUTCDate, getUTCHours, getUTCMinutes, getUTCSeconds, getUTCMilliseconds} =
  Date.prototype;
const PAD2 = Array.from({length: 100}, (_, i) => (i < 10 ? "0" : "") + i);

/**
 * Same output as toISOString(), built from the UTC parts: about 3x faster on Node 24.
 * The native getters are called, so a subclass that overrides them still gives its real date.
 * Years outside 1000-9999 and invalid dates keep toISOString(), for the expanded form and the RangeError.
 */
function toISO(date: Date): string {
  const year = getUTCFullYear.call(date);

  if (!(year >= 1000 && year <= 9999)) {
    return toISOString.call(date);
  }

  const ms = getUTCMilliseconds.call(date);

  return (
    year +
    "-" +
    PAD2[getUTCMonth.call(date) + 1] +
    "-" +
    PAD2[getUTCDate.call(date)] +
    "T" +
    PAD2[getUTCHours.call(date)] +
    ":" +
    PAD2[getUTCMinutes.call(date)] +
    ":" +
    PAD2[getUTCSeconds.call(date)] +
    "." +
    (ms < 10 ? "00" : ms < 100 ? "0" : "") +
    ms +
    "Z"
  );
}

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
    return object ? toISO(object instanceof Date ? object : new Date(object)) : object;
  }
}
