import type {Infer} from "../domain/types.js";
import {getJsonEntityStore, getJsonMethodStore} from "../registries/JsonEntitiesContainer.js";
import {mergeSchema} from "../utils/mergeSchema.js";
import {allOf} from "./allOf.js";
import {any} from "./any.js";
import {anyOf} from "./anyOf.js";
import {boolean} from "./boolean.js";
import {array, map, record, set} from "./collection.js";
import {compile} from "./compile.js";
import {date, datetime, time} from "./date.js";
import {email} from "./email.js";
import {enums} from "./enums.js";
import {from, get} from "./from.js";
import {generic} from "./generic.js";
import {integer} from "./integer.js";
import {lazyRef} from "./lazyRef.js";
import {number} from "./number.js";
import {compileSpec} from "./oas/compileSpec.js";
import {mergeSpec} from "./oas/mergeSpec.js";
import {object} from "./object.js";
import {oneOf} from "./oneOf.js";
import {ref} from "./ref.js";
import {string} from "./string.js";
import {uri} from "./uri.js";
import {url} from "./url.js";

/**
 * A namespace of all schema builder functions.
 * @schemaFunctional
 */
export const s = {
  from,
  allOf,
  anyOf,
  any,
  boolean,
  array,
  map,
  set,
  record,
  date,
  datetime,
  time,
  email,
  enums,
  integer,
  number,
  lazyRef,
  object,
  oneOf,
  $ref: ref,
  string,
  uri,
  url,
  generic,
  get,
  store: Object.assign(getJsonEntityStore, {
    get: getJsonEntityStore,
    method: getJsonMethodStore
  }),
  schema: {
    compile,
    merge: mergeSchema
  },
  compile,
  oas: Object.assign(compileSpec, {
    compile: compileSpec,
    merge: mergeSpec
  })
} as const;

// Attach type helper via namespace merging to avoid separate export conflicts
export namespace s {
  // Re-export the type-level infer on the value namespace
  export type infer<S> = Infer<S>;
}
