import {Component} from "./component";

/**
 * Set URL data on the current component.
 * @param url
 * @param props
 * @constructor
 */
export function DataSourceUrl(url: string, props: Record<string, any> = {}) {
  return Component({
    ...props,
    dataSrc: "url",
    data: {
      ...props.data,
      url
    }
  });
}
