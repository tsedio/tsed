import {constant, DIContext, injectable, injector, logger, Provider, runInContext} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {Agenda, type AgendaOptions, type Job} from "agenda";
import {v4 as uuid} from "uuid";

import {PROVIDER_TYPE_AGENDA} from "../constants/constants.js";
import type {AgendaStore} from "../interfaces/AgendaStore.js";
import type {AgendaSettings} from "../interfaces/interfaces.js";

type JobProcessor = (job: Job<unknown>) => Promise<void>;

function getOpts(): AgendaSettings | false {
  return constant<AgendaSettings | false>("agenda", false);
}

function getEnabledAgendaOptions(settings: AgendaSettings): AgendaOptions {
  const {enabled, disableJobProcessing, drainJobsBeforeClose, ...agendaOptions} = settings;
  return agendaOptions as AgendaOptions;
}

function addAgendaDefinitionsForProvider(agenda: Agenda, provider: Provider): void {
  const store = provider.store.get<AgendaStore>("agenda", {});

  if (!store.define) {
    return;
  }

  Object.entries(store.define).forEach(([propertyKey, {name, ...options}]) => {
    const instance = injector().get(provider.token);

    const jobProcessor: JobProcessor = async (job) => {
      await Promise.resolve(instance[propertyKey].call(instance, job));
    };
    const jobName = getNameForJob(propertyKey, store.namespace, name);

    agenda.define(jobName, jobProcessor, options);
  });
}

async function scheduleJobsForProvider(agenda: Agenda, provider: Provider): Promise<void> {
  const store = provider.store.get<AgendaStore>("agenda", {});

  if (!store.every) {
    return;
  }

  const promises = Object.entries(store.every).map(([propertyKey, {interval, name, ...options}]) => {
    const jobName = getNameForJob(propertyKey, store.namespace, name);

    return agenda.every(interval, jobName, {}, options);
  });

  await Promise.all(promises);
}

function getNameForJob(propertyKey: string, namespace?: string, customName?: string): string {
  const name = customName || propertyKey;

  return namespace ? `${namespace}.${name}` : name;
}

async function afterListen(agenda: Agenda) {
  const opts = getOpts();

  if (opts && opts.enabled) {
    const providers = injector().getProviders(PROVIDER_TYPE_AGENDA);

    if (!opts.disableJobProcessing) {
      logger().info({
        event: "AGENDA_ADD_DEFINITIONS",
        message: "Agenda add definitions"
      });

      providers.forEach((provider) => addAgendaDefinitionsForProvider(agenda, provider));

      await $asyncEmit("$beforeAgendaStart");
    }

    await agenda.start();

    if (!opts.disableJobProcessing) {
      logger().info({
        event: "AGENDA_ADD_JOBS",
        message: "Agenda add scheduled jobs"
      });

      await Promise.all(providers.map((provider) => scheduleJobsForProvider(agenda, provider)));

      await $asyncEmit("$afterAgendaStart");
    }
  }
}

async function onDestroy(agenda: Agenda) {
  const opts = getOpts();

  if (opts && opts.enabled) {
    if (opts.drainJobsBeforeClose && "drain" in agenda) {
      logger().info({
        event: "AGENDA_DRAIN",
        message: "Agenda is draining all jobs before close"
      });
      await agenda.drain();
    } else {
      logger().info({
        event: "AGENDA_STOP",
        message: "Agenda is stopping"
      });
      await agenda.stop();
    }

    logger().info({event: "AGENDA_STOP", message: "Agenda stopped"});
  }
}

export const AgendaService = injectable(Agenda)
  .factory(() => {
    const opts = getOpts();

    if (opts && opts.enabled) {
      const agenda = new Agenda(getEnabledAgendaOptions(opts));

      return new Proxy(agenda, {
        set(target, prop, value) {
          return Reflect.set(target, prop, value);
        },

        get(target, prop) {
          if (prop === "agenda") {
            return target;
          }

          if (prop === "$define") {
            return Reflect.get(target, "define", target);
          }

          if (prop === "define") {
            return (name: string, processor: any, options?: any) => {
              return target["define"](
                name,
                async (job: any) => {
                  const $ctx = new DIContext({
                    id: uuid()
                  });

                  $ctx.set("job", job);

                  await Promise.resolve(runInContext($ctx, () => processor(job)));
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
 * @deprecated Use `Agenda` from `agenda` instead.
 */
export type AgendaService = Agenda;
