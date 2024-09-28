import {StoreSet, useDecorators} from "@tsed/core";
import {Property} from "@tsed/schema";

import {ColumnOptions} from "./columnOptions.js";

export interface DecimalOptions {
  precision?: number | null;
  scale?: number;
}

/**
 *
 * @param options
 * @decorator
 * @objection
 */
export function Decimal(options: DecimalOptions = {}) {
  return useDecorators(
    Property(),
    ColumnOptions({
      columnType: "number",
      options: {
        type: "decimal",
        ...options
      }
    }),
    StoreSet("objection", {
      columnType: "number",
      options: {
        type: "decimal",
        ...options
      }
    })
  );
}
