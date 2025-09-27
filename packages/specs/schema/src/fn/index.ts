import {allOf} from "./allOf.js";
import {anyOf} from "./anyOf.js";
import {boolean} from "./boolean.js";
import {array, map, set} from "./collection.js";
import {date, datetime, time} from "./date.js";
import {email} from "./email.js";
import {enums} from "./enums.js";
import {integer} from "./integer.js";
import {lazyRef} from "./lazyRef.js";
import {number} from "./number.js";
import {object} from "./object.js";
import {oneOf} from "./oneOf.js";
import {string} from "./string.js";
import {uri} from "./uri.js";
import {url} from "./url.js";

export const s = {
  allOf,
  anyOf,
  boolean,
  array,
  map,
  set,
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
  string,
  uri,
  url
} as const;
