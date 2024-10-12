import {Constant, DIContext, Inject, InjectorService, Module, OnDestroy, Provider, runInContext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {AfterListen} from "@tsed/platform-http";
import {Job, Processor} from "agenda";
import {v4 as uuid} from "uuid";

import {PROVIDER_TYPE_AGENDA} from "./constants/constants.js";
import {AgendaStore} from "./interfaces/AgendaStore.js";
import {AgendaService} from "./services/AgendaFactory.js";

@Module()
export class AgendaModule implements OnDestroy, AfterListen {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected agenda: AgendaService;

  @Constant("agenda.enabled", false)
  private enabled: boolean;

  @Constant("agenda.drainJobsBeforeClose", false)
  private drainJobsBeforeClose: boolean;

  @Constant("agenda.disableJobProcessing", false)
  private disableJobProcessing: boolean;

  async $afterListen(): Promise<any> {
    if (this.enabled) {
      const providers = this.getProviders();

      if (!this.disableJobProcessing) {
        this.logger.info({
          event: "AGENDA_ADD_DEFINITIONS",
          message: "Agenda add definitions"
        });
        providers.forEach((provider) => this.addAgendaDefinitionsForProvider(provider));

        await this.injector.emit("$beforeAgendaStart");
      }

      await this.agenda.start();

      if (!this.disableJobProcessing) {
        this.logger.info({
          event: "AGENDA_ADD_JOBS",
          message: "Agenda add scheduled jobs"
        });
        await Promise.all(providers.map((provider) => this.scheduleJobsForProvider(provider)));

        await this.injector.emit("$afterAgendaStart");
      }
    }
  }

  async $onDestroy(): Promise<any> {
    if (this.enabled) {
      if (this.drainJobsBeforeClose && "drain" in this.agenda) {
        this.logger.info({
          event: "AGENDA_DRAIN",
          message: "Agenda is draining all jobs before close"
        });
        await this.agenda.drain();
      } else {
        this.logger.info({
          event: "AGENDA_STOP",
          message: "Agenda is stopping"
        });
        await this.agenda.stop();
      }

      await this.agenda.close({force: true});

      this.logger.info({event: "AGENDA_STOP", message: "Agenda stopped"});
    }
  }

  define(name: string, options?: any, processor?: any) {
    return this.agenda.define(name, options, (job: Job) => {
      const $ctx = new DIContext({
        injector: this.injector,
        id: uuid(),
        logger: this.injector.logger
      });

      $ctx.set("job", job);

      return runInContext($ctx, () => processor(job));
    });
  }

  every(interval: string, name: string, data?: any, options?: any) {
    return this.agenda.every(interval, name, data, options);
  }

  schedule(when: Date | string, name: string, data?: any) {
    return this.agenda.schedule(when, name, data);
  }

  now(name: string, data?: any) {
    return this.agenda.now(name, data);
  }

  create(name: string, data?: any) {
    return this.agenda.create(name, data);
  }

  protected getProviders(): Provider<any>[] {
    return this.injector.getProviders(PROVIDER_TYPE_AGENDA);
  }

  protected addAgendaDefinitionsForProvider(provider: Provider): void {
    const store = provider.store.get<AgendaStore>("agenda", {});

    if (!store.define) {
      return;
    }

    Object.entries(store.define).forEach(([propertyKey, {name, ...options}]) => {
      const instance = this.injector.get(provider.token);

      const jobProcessor: Processor<unknown> = instance[propertyKey].bind(instance) as Processor<unknown>;
      const jobName = this.getNameForJob(propertyKey, store.namespace, name);

      this.define(jobName, options, jobProcessor);
    });
  }

  protected async scheduleJobsForProvider(provider: Provider<any>): Promise<void> {
    const store = provider.store.get<AgendaStore>("agenda", {});

    if (!store.every) {
      return;
    }

    const promises = Object.entries(store.every).map(([propertyKey, {interval, name, ...options}]) => {
      const jobName = this.getNameForJob(propertyKey, store.namespace, name);

      return this.every(interval, jobName, {}, options);
    });

    await Promise.all(promises);
  }

  protected getNameForJob(propertyKey: string, namespace?: string, customName?: string): string {
    const name = customName || propertyKey;

    return namespace ? `${namespace}.${name}` : name;
  }
}
