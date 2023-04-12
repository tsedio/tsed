import {isBoolean} from "@tsed/core";
import {DateFormat} from "@tsed/schema";
import {JsonMapper, JsonMapperContext, JsonMapperMethods, serialize} from "../../src/index";

@JsonMapper(Date)
export class DateMapper implements JsonMapperMethods {
  deserialize(data: string | number, ctx: JsonMapperContext): Date;
  deserialize(data: boolean | null | undefined, ctx: JsonMapperContext): boolean | null | undefined;
  deserialize(data: any, ctx: JsonMapperContext): any {
    // don't convert unexpected data. In normal case, Ajv reject unexpected data.
    // But by default, we have to skip data deserialization and let user to apply
    // the right mapping
    if (isBoolean(data) || data === null || data === undefined) {
      return data;
    }

    return new Date(data);
  }

  serialize(object: Date, ctx: JsonMapperContext): any {
    const date = new Date(object);

    switch (ctx.options.format) {
      case "date":
        const y = date.getUTCFullYear();
        const m = ("0" + (date.getUTCMonth() + 1)).slice(-2);
        const d = ("0" + date.getUTCDate()).slice(-2);

        return `${y}-${m}-${d}`;
      default:
        return new Date(object).toISOString();
    }
  }
}

describe("Date format", () => {
  it("should serialize date to the expected format", () => {
    class Model {
      @DateFormat()
      date = new Date("2023-03-04");
    }

    expect(serialize(new Model())).toEqual({
      date: "2023-03-04"
    });
  });
});
