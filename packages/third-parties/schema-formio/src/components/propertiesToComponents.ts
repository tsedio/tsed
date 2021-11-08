import {cleanObject, isFunction} from "@tsed/core";
import {sentenceCase} from "change-case";
import {FormioComponent, FormioForm} from "@tsed/formio-types";
import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer";

function bindResolvers(component: FormioComponent, options: any) {
  if (component.data) {
    const data = component.data;

    Object.entries(data).forEach(([key, resolver]) => {
      if (isFunction(resolver)) {
        options.resolvers.push(async (form: FormioForm) => {
          data[key] = await resolver({...options, component, form});
        });
      }
    });
  }
}

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
    const base = execMapper("any", propSchema, {parentKey: key, ...options});

    const component = cleanObject({
      key,
      label: sentenceCase(key),
      ...base,
      validate: cleanObject({
        ...(base.validate || {}),
        required: (schema.required || []).includes(key),
        pattern: propSchema.pattern,
        minLength: !schema.required || (schema.required && propSchema.minLength !== 1) ? propSchema.minLength : undefined,
        maxLength: propSchema.maxLength,
        min: propSchema.minimum,
        max: propSchema.maximum
      })
    });

    bindResolvers(component, options);

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
