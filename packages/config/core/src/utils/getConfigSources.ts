import {nameOf, type Type} from "@tsed/core";
import {inject, injectable, ProviderScope} from "@tsed/di";
import {camelCase} from "change-case";

import type {ConfigSource, ConfigSourceOptions} from "../interfaces/ConfigSource.js";

export function getConfigSources(configSources: (Type<ConfigSource<any>> | ConfigSourceOptions)[]) {
  return configSources
    .map((configSource, index) => {
      if (!("use" in configSource)) {
        return {
          name: camelCase(nameOf(configSource).replace("ConfigSource", "")),
          use: configSource,
          options: {},
          priority: index,
          enabled: true
        } satisfies ConfigSourceOptions;
      }

      return {
        enabled: true,
        ...configSource,
        priority: configSource.priority || 0,
        name: configSource.name || camelCase(nameOf(configSource.use).replace("ConfigSource", ""))
      } satisfies ConfigSourceOptions;
    })
    .sort((a, b) => a.priority! - b.priority!)
    .filter(({enabled}) => enabled)
    .reduce((map, options, index) => {
      let {use, name, options: useOpts} = options;

      injectable(use).scope(ProviderScope.INSTANCE);

      const instance = inject(use, {
        useOpts
      });

      instance.options = useOpts;

      if (map.has(name)) {
        name = `${name}_${index}`;
      }

      map.set(name, {
        ...options,
        instance,
        data: {}
      });

      return map;
    }, new Map<string, ConfigSourceOptions & {instance: ConfigSource<any>; data: Record<string, any>}>());
}
