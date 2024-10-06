import {StoreSet} from "@tsed/core";

import type {ColumnOpts} from "../domain/ColumnOpts.js";

/**
 *
 * @param options
 * @decorator
 * @objection
 */
export function ColumnOptions(options: Partial<ColumnOpts>): PropertyDecorator {
  return StoreSet("objection", options) as any;
}
