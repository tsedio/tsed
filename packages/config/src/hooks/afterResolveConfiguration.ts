import "@tsed/ajv";

import {configuration, constant, injectable, logger} from "@tsed/di";
import {$on} from "@tsed/hooks";

import {CONFIG_SOURCES} from "../constants/constants.js";
import type {ConfigurationExtends} from "../interfaces/ConfigSource.js";
import {getConfigSources} from "../utils/getConfigSources.js";
import {validate} from "../utils/validate.js";

export async function afterResolveConfiguration() {
  const sources = getConfigSources(constant<ConfigurationExtends>("extends", []));

  for (const source of sources.values()) {
    const {instance, options, watch, refreshOn, name, validationSchema} = source;

    const refresh = async () => {
      let data = await instance.getAll();

      if (validationSchema) {
        data = await validate(name!, data, validationSchema);
      }

      source.data = data;
      configuration().set(data);
    };

    await refresh();

    // manage watcher
    if (watch && instance?.watch) {
      const closer = await instance.watch(refresh);

      $on("$onDestroy", closer);
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

  configuration().set(
    "configs",
    Object.fromEntries(
      [...sources.entries()].map(([key, source]) => {
        return [key, source.data];
      })
    )
  );

  const configs = Object.fromEntries(
    [...sources.entries()].map(([key, source]) => {
      return [key, source.instance];
    })
  );
  injectable(CONFIG_SOURCES).value(configs);
}

$on("$afterResolveConfiguration", afterResolveConfiguration);
