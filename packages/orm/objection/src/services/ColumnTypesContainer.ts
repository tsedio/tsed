import type {Knex} from "knex";

import type {ColumnCtx} from "../utils/getColumnCtx.js";

/**
 * @ignore
 */
export const ColumnTypesContainer: Map<string, (table: Knex.TableBuilder, ctx: ColumnCtx) => void> = new Map();
