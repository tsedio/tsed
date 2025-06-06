import {constant, DIContext, injectable, injector, logger, Provider, runInContext} from "@tsed/di";
import {$asyncEmit} from "@tsed/hooks";
import {Agenda, Processor} from "agenda";
import {v4 as uuid} from "uuid";

import {PROVIDER_TYPE_AGENDA} from "../constants/constants.js";
import type {AgendaStore} from "../interfaces/AgendaStore.js";
import type {AgendaSettings} from "../interfaces/interfaces.js";

function getOpts() {
  return constant<AgendaSettings>("agenda", {enabled: false});
}

function addAgendaDefinitionsForProvider(agenda: Agenda, provider: Provider): void {
  const store = provider.store.get<AgendaStore>("agenda", {});

  if (!store.define) {
    return;
  }

  Object.entries(store.define).forEach(([propertyKey, {name, ...options}]) => {
    const instance = injector().get(provider.token);

    const jobProcessor: Processor<unknown> = instance[propertyKey].bind(instance) as Processor<unknown>;
    const jobName = getNameForJob(propertyKey, store.namespace, name);

    agenda.define(jobName, options, jobProcessor);
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

  if (opts.enabled) {
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

  if (opts.enabled) {
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

    await agenda.close({force: true});

    logger().info({event: "AGENDA_STOP", message: "Agenda stopped"});
  }
}

export const AgendaService = injectable(Agenda)
  .factory(() => {
    const opts = getOpts();

    if (opts.enabled) {
      const agenda = new Agenda(opts);

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
            return (name: string, options: any, processor: any) => {
              return target["define"](name, options, (job: any) => {
                const $ctx = new DIContext({
                  id: uuid()
                });

                $ctx.set("job", job);

                return runInContext($ctx, () => processor(job));
              });
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
/**
 * @deprecated Use `Agenda` from `agenda` instead.
 */
export const AgendaModule = Agenda;
export type AgendaModule = Agenda;
