import {ColumnCtx} from "../utils/getColumnCtx.js";
import type {Knex} from "knex";

/**
 * @ignore
 */
export const ColumnTypesContainer: Map<string, (table: Knex.TableBuilder, ctx: ColumnCtx) => void> = new Map();
