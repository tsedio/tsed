import {isFunction} from "@tsed/core";

import {FormioDataResolver, FormioDataResolverCtx} from "../domain/FormioDataResolver.js";
import {Component} from "./component.js";

const wrap = (resolver: FormioDataResolver) => async (opts: FormioDataResolverCtx) => {
  const result = await resolver(opts);
  return JSON.stringify(result);
};

/**
 * Set custom json data source
 * @param data
 * @param props
 * @constructor
 */
export function DataSourceJson(data: any | FormioDataResolver, props: Record<string, any> = {}) {
  return Component({
    ...props,
    dataSrc: "json",
    data: {
      ...props.data,
      json: isFunction(data) ? wrap(data) : JSON.stringify(data)
    }
  });
}
