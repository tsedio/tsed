import {cleanObject} from "@tsed/core";
import {sentenceCase} from "change-case";
import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";

export function propertiesToComponents(schema: any, options: any): any[] {
  const tabs = {
    label: "Tabs",
    key: "tabs",
    type: "tabs",
    input: false,
    tableView: false,
    components: new Map<string, any>(),
    pushed: false
  };

  const components: any[] = [];

  Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
    const tabsOptions = propSchema["x-formiotabs"];

    const component = cleanObject({
      key,
      label: sentenceCase(key),
      ...execMapper("any", propSchema, {parentKey: key, ...options}),
      validate: {
        required: (schema.required || []).includes(key)
      }
    });

    if (tabsOptions) {
      if (!tabs.pushed) {
        components.push(tabs);
        tabs.pushed = true;
      }

      if (!tabs.components.has(tabsOptions.key)) {
        tabs.components.set(tabsOptions.key, {
          ...tabsOptions,
          components: []
        });
      }

      tabs.components.get(tabsOptions.key).components.push(component);
    } else {
      components.push(component);
    }
  });

  if (tabs.components.size) {
    tabs.components = [...tabs.components.values()] as any;
  }

  return components;
}

registerFormioMapper("properties", propertiesToComponents);
