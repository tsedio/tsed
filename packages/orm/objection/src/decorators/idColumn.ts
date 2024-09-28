import {useDecorators} from "@tsed/core";
import {Property} from "@tsed/schema";

import {defineStaticGetter} from "../utils/defineStaticGetter.js";
import {ColumnOptions} from "./columnOptions.js";

/**
 *
 * @param type
 * @decorator
 * @objection
 */
export function IdColumn(type: "uuid" | "increments" | "bigIncrements" = "increments"): PropertyDecorator {
  return useDecorators(
    Property(),
    ColumnOptions({
      columnType: "idColumn",
      options: {
        type
      }
    }),
    (target: any, propertyKey: string) => {
      defineStaticGetter(target, "idColumn", () => propertyKey);
    }
  );
}
