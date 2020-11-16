import {StoreSet} from "@tsed/core";
import type {ColumnOptions} from "../domain/ColumnOptions";

export function ColumnOptions(options: Partial<ColumnOptions>): PropertyDecorator {
  return StoreSet("objection", options) as any;
}
