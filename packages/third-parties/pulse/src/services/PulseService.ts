import {type JobAttributesData, Processor, Pulse} from "@pulsecron/pulse";
import {constant, DIContext, injectable, injector, logger, Provider, runInContext} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {v4 as uuid} from "uuid";

import {PROVIDER_TYPE_PULSE} from "../constants/constants.js";
import type {PulseSettings} from "../interfaces/interfaces.js";
import type {PulseStore} from "../interfaces/PulseStore.js";

function getOpts() {
  return constant<PulseSettings>("pulse", {enabled: false});
}

function addPulseDefinitionsForProvider(pulse: Pulse, provider: Provider): void {
  const store = provider.store.get<PulseStore>("pulse", {});

  if (!store.define) {
    return;
  }

  Object.entries(store.define).forEach(([propertyKey, {name, ...options}]) => {
    const instance = injector().get(provider.token);

    const jobProcessor: Processor<JobAttributesData> = instance[propertyKey].bind(instance) as Processor<JobAttributesData>;
    const jobName = getNameForJob(propertyKey, store.namespace, name);

    pulse.define(jobName, jobProcessor, options);
  });
}

async function scheduleJobsForProvider(pulse: Pulse, provider: Provider): Promise<void> {
  const store = provider.store.get<PulseStore>("pulse", {});

  if (!store.every) {
    return;
  }

  const promises = Object.entries(store.every).map(([propertyKey, {interval, name, ...options}]) => {
    const jobName = getNameForJob(propertyKey, store.namespace, name);

    return pulse.every(interval, jobName, {}, options);
  });

  await Promise.all(promises);
}

function getNameForJob(propertyKey: string, namespace?: string, customName?: string): string {
  const name = customName || propertyKey;

  return namespace ? `${namespace}.${name}` : name;
}

async function afterListen(pulse: Pulse) {
  const opts = getOpts();

  if (opts.enabled) {
    const providers = injector().getProviders(PROVIDER_TYPE_PULSE);

    if (!opts.disableJobProcessing) {
      logger().info({
        event: "PULSE_ADD_DEFINITIONS",
        message: "Pulse add definitions"
      });

      providers.forEach((provider) => addPulseDefinitionsForProvider(pulse, provider));

      await $asyncEmit("$beforePulseStart");
    }

    await pulse.start();

    if (!opts.disableJobProcessing) {
      logger().info({
        event: "PULSE_ADD_JOBS",
        message: "Pulse add scheduled jobs"
      });

      await Promise.all(providers.map((provider) => scheduleJobsForProvider(pulse, provider)));

      await $asyncEmit("$afterPulseStart");
    }
  }
}

async function onDestroy(pulse: Pulse) {
  const opts = getOpts();

  if (opts.enabled) {
    if (opts.drainJobsBeforeClose && "drain" in pulse) {
      logger().info({
        event: "PULSE_DRAIN",
        message: "Pulse is draining all jobs before close"
      });
      await pulse.drain();
    } else {
      logger().info({
        event: "PULSE_STOP",
        message: "Pulse is stopping"
      });
      await pulse.stop();
    }

    await pulse.close({force: true});

    logger().info({event: "PULSE_STOP", message: "Pulse stopped"});
  }
}

export const PulseService = injectable(Pulse)
  .factory(() => {
    const opts = getOpts();

    if (opts.enabled) {
      const pulse = new Pulse(opts);

      return new Proxy(pulse, {
        set(target, prop, value) {
          return Reflect.set(target, prop, value);
        },

        get(target, prop) {
          if (prop === "pulse") {
            return target;
          }

          if (prop === "$define") {
            return Reflect.get(target, "define", target);
          }

          if (prop === "define") {
            return (name: string, processor: any, options: any) => {
              return target["define"](
                name,
                (job) => {
                  const $ctx = new DIContext({
                    id: uuid()
                  });

                  $ctx.set("job", job);

                  return runInContext($ctx, () => processor(job));
                },
                options
              );
            };
          }

          return Reflect.get(target, prop, target);
        }
      });
    }

    return new Proxy({}, {get: () => () => Promise.resolve()});
  })
  .hooks({
    $afterListen: afterListen,
    $onDestroy: onDestroy
  })
  .token();

/**
 * @deprecated Use `Pulse` from `pulse` instead.
 */
export type PulseService = Pulse;
/**
 * @deprecated Use `Pulse` from `pulse` instead.
 */
export const PulseModule = Pulse;
export type PulseModule = Pulse;
