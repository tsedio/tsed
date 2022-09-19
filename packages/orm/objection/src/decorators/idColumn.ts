import {ColumnOptions} from "./columnOptions";
import {Property} from "@tsed/schema";
import {defineStaticGetter} from "../utils/defineStaticGetter";
import {useDecorators} from "@tsed/core";

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
