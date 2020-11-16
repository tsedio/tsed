import {useDecorators} from "@tsed/core";
import {Property} from "@tsed/schema";
import {defineStaticGetter} from "../utils/defineStaticGetter";
import {ColumnOptions} from "./columnOptions";

export function IdColumn(type: "increments" | "bigIncrements" = "increments"): PropertyDecorator {
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
