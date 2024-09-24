import {Store} from "@tsed/core";
import {getJsonSchema} from "@tsed/schema";

import {Decimal} from "./decimal.js";

describe("@Decimal", () => {
  it("should set metadata", () => {
    class MyModel {
      @Decimal({scale: 1, precision: 12})
      prop: number;
    }

    expect(getJsonSchema(MyModel)).toEqual({
      properties: {
        prop: {
          type: "number"
        }
      },
      type: "object"
    });
    expect(Store.from(MyModel, "prop").get("objection")).toEqual({
      columnType: "number",
      options: {
        precision: 12,
        scale: 1,
        type: "decimal"
      }
    });
  });

  it("should set metadata (without options)", () => {
    class MyModel {
      @Decimal()
      prop: number;
    }

    expect(getJsonSchema(MyModel)).toEqual({
      properties: {
        prop: {
          type: "number"
        }
      },
      type: "object"
    });
    expect(Store.from(MyModel, "prop").get("objection")).toEqual({
      columnType: "number",
      options: {
        type: "decimal"
      }
    });
  });
});
