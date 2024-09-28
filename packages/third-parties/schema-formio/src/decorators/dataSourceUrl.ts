import {FormioDataResolver} from "../domain/FormioDataResolver.js";
import {Component} from "./component.js";

/**
 * Set URL data on the current component.
 * @param url
 * @param props
 * @constructor
 */
export function DataSourceUrl(url: string | FormioDataResolver, props: Record<string, any> = {}) {
  return Component({
    ...props,
    dataSrc: "url",
    data: {
      ...props.data,
      url
    }
  });
}
