import {cleanObject, isFunction} from "@tsed/core";
import {FormioComponent, FormioForm} from "@tsed/formio-types";
import {sentenceCase} from "change-case";

import {execMapper, registerFormioMapper} from "../registries/FormioMappersContainer.js";

function bindResolvers(component: FormioComponent, options: any) {
  if (component.data) {
    const data = {...component.data};

    Object.entries(data).forEach(([key, resolver]) => {
      if (isFunction(resolver)) {
        options.resolvers.push(async (form: FormioForm) => {
          data[key] = await resolver({...options, component, form});
        });
      }
    });

    return {
      ...component,
      data
    };
  }

  return component;
}

function mapValidation(key: string, base: FormioComponent, schema: any, propSchema: any) {
  const required = (schema.required || []).includes(key);
  const validate = {
    ...(base.validate || {}),
    required,
    pattern: propSchema.pattern,
    minLength: !required || (required && propSchema.minLength > 1) ? propSchema.minLength : undefined,
    maxLength: propSchema.maxLength,
    min: propSchema.minimum || propSchema.minItems,
    max: propSchema.maximum || propSchema.maxItems
  };

  switch (propSchema.type) {
    case "string":
      if (propSchema.minLength === 0 && validate.required) {
        validate.minLength = undefined;
        validate.required = false;
      }
      break;
    case "boolean":
      validate.required = false;
      break;
  }

  return cleanObject(validate);
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
    const base = execMapper("any", propSchema, {...options, parentKey: key});

    let component = cleanObject({
      key,
      ...base,
      label: base.label == false ? undefined : base.label || propSchema.title || sentenceCase(key),
      validate: mapValidation(key, base, schema, propSchema)
    });

    component = bindResolvers(component, options);

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
