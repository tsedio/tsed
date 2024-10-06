import {useDecorators} from "@tsed/core";
import {CollectionOf} from "@tsed/schema";

import {Component} from "./component.js";
/**
 * Configure the property as Tags component.
 * @decorator
 * @formio
 * @property
 * @schema
 */
export function InputTags(props: Record<string, any> = {}): PropertyDecorator {
  return useDecorators(
    CollectionOf(String),
    Component({
      ...props,
      tableView: false,
      storeas: "array",
      type: "tags"
    })
  );
}
