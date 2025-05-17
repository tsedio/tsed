import "@tsed/ajv";

import {configuration, constant, inject, injectable, logger} from "@tsed/di";
import {$on} from "@tsed/hooks";

import {CONFIG_SOURCES} from "../constants/constants.js";
import type {ConfigurationExtends} from "../interfaces/ConfigSource.js";
import {getConfigSources} from "../utils/getConfigSources.js";
import {validate} from "../utils/validate.js";

export async function afterResolveConfiguration() {
  const sources = getConfigSources(constant<ConfigurationExtends>("extends", []));

  for (const source of sources.values()) {
    const {instance, watch, refreshOn, name, validationSchema} = source;

    if (instance?.$onInit) {
      await instance.$onInit();
    }

    const getAll = instance.getAll;

    const refresh = async () => {
      let data = await getAll.apply(instance);

      if (validationSchema) {
        data = await validate(name!, data, validationSchema);
      }

      configuration().set(data);
      configuration().set(`configs.${name}`, data);

      return data;
    };

    instance.getAll = refresh as any;

    await refresh();

    // manage watcher
    if (watch && instance?.watch) {
      const closer = await instance.watch(refresh);

      closer && $on("$onDestroy", closer);
    }

    // manager refresh on request
    if (refreshOn === "request") {
      $on("$onRequest", () => {
        return refresh();
      });
    }

    // manager refresh on response
    if (refreshOn === "response") {
      $on("$onResponse", () => {
        refresh().catch((error) => {
          logger().error({
            event: "CONFIG_SOURCE_REFRESH_ERROR",
            hook: "$onResponse",
            error_name: error.name,
            error_message: error.message,
            error_stack: error.stack
          });
        });
      });
    }
  }

  const configs = Object.fromEntries(
    [...sources.entries()].map(([key, source]) => {
      return [key, source.instance];
    })
  );

  injectable(CONFIG_SOURCES).value(configs);
}

$on("$afterResolveConfiguration", afterResolveConfiguration);
$on("$onDestroy", () => {
  const configs = inject<CONFIG_SOURCES>(CONFIG_SOURCES);

  const promises = Object.values(configs).map((config) => {
    return config.$onDestroy?.();
  });

  return Promise.all(promises);
});
