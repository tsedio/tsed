import {isEmpty} from "@tsed/core";
import qs from "querystring";
import {inspect} from "util";

const keys = new Set();

function serialize(obj: any) {
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    keys.add(key);

    if (isEmpty(value)) {
      return acc;
    }

    acc[key] = inspect(value, {depth: null});
    return acc;
  }, {});
}

export const debug = (obj: any) =>
  qs.stringify(serialize(obj), "<br/>", ": ", {
    encodeURIComponent(value) {
      return keys.has(value) ? `<strong>${value}</strong>` : value;
    }
  });
