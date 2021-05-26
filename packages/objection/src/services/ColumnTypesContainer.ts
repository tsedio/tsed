import Knex from "knex";
import {ColumnCtx} from "../utils/getColumnCtx";

/**
 * @ignore
 */
export const ColumnTypesContainer: Map<string, (table: Knex.TableBuilder, ctx: ColumnCtx) => void> = new Map();
