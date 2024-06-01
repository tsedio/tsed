import {getColumns} from "./createColumns.js";

/**
 * @ignore
 */
export const OBJECTION_RELATIONSHIP_KEY = "objectionRelationship";

/**
 * @ignore
 */
export function getJsonEntityRelationships(target: any) {
  return getColumns(target)
    .filter((col) => col.store.get(OBJECTION_RELATIONSHIP_KEY))
    .map((col) => col.store.get(OBJECTION_RELATIONSHIP_KEY)(target))
    .reduce((dict, col) => ({...dict, ...col}), {});
}
