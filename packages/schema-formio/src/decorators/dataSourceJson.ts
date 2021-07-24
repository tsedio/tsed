import {Component} from "./component";

/**
 * Set custom json data source
 * @param data
 * @param props
 * @constructor
 */
export function DataSourceJson(data: any, props: Record<string, any> = {}) {
  return Component({
    ...props,
    dataSrc: "json",
    data: {
      ...props.data,
      json: JSON.stringify(data)
    }
  });
}
