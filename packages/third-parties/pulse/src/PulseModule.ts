import {DefineOptions, Job, JobAttributesData, Processor} from "@pulsecron/pulse";
import {Constant, DIContext, Inject, InjectorService, Module, OnDestroy, Provider, runInContext} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {AfterListen} from "@tsed/platform-http";
import {v4 as uuid} from "uuid";

import {PROVIDER_TYPE_PULSE} from "./constants/constants.js";
import {PulseStore} from "./interfaces/PulseStore.js";
import {PulseService} from "./services/PulseFactory.js";

@Module()
export class PulseModule implements OnDestroy, AfterListen {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected pulse: PulseService;

  @Constant("pulse.enabled", false)
  private enabled: boolean;

  @Constant("pulse.drainJobsBeforeClose", false)
  private drainJobsBeforeClose: boolean;

  @Constant("pulse.disableJobProcessing", false)
  private disableJobProcessing: boolean;

  async $afterListen(): Promise<any> {
    if (this.enabled) {
      const providers = this.getProviders();

      if (!this.disableJobProcessing) {
        this.logger.info({
          event: "PULSE_ADD_DEFINITIONS",
          message: "Pulse add definitions"
        });
        providers.forEach((provider) => this.addPulseDefinitionsForProvider(provider));

        await this.injector.emit("$beforePulseStart");
      }

      await this.pulse.start();

      if (!this.disableJobProcessing) {
        this.logger.info({
          event: "PULSE_ADD_JOBS",
          message: "Pulse add scheduled jobs"
        });
        await Promise.all(providers.map((provider) => this.scheduleJobsForProvider(provider)));

        await this.injector.emit("$afterPulseStart");
      }
    }
  }

  async $onDestroy(): Promise<any> {
    if (this.enabled) {
      if (this.drainJobsBeforeClose && "drain" in this.pulse) {
        this.logger.info({
          event: "PULSE_DRAIN",
          message: "Pulse is draining all jobs before close"
        });
        await this.pulse.drain();
      } else {
        this.logger.info({
          event: "PULSE_STOP",
          message: "Pulse is stopping"
        });
        await this.pulse.stop();
      }

      await this.pulse.close({force: true});

      this.logger.info({event: "PULSE_STOP", message: "Pulse stopped"});
    }
  }

  define<T extends JobAttributesData>(name: string, processor: Processor<T>, options?: DefineOptions) {
    return this.pulse.define(
      name,
      (job: Job<T>, ...rest) => {
        const $ctx = new DIContext({
          injector: this.injector,
          id: uuid(),
          logger: this.injector.logger
        });

        $ctx.set("job", job);

        return runInContext($ctx, () => processor(job, ...rest));
      },
      options
    );
  }

  every(interval: string, name: string, data?: any, options?: any) {
    return this.pulse.every(interval, name, data, options);
  }

  schedule(when: Date | string, name: string, data?: any) {
    return this.pulse.schedule(when, name, data);
  }

  now(name: string, data?: any) {
    return this.pulse.now(name, data);
  }

  create(name: string, data?: any) {
    return this.pulse.create(name, data);
  }

  protected getProviders(): Provider<any>[] {
    return this.injector.getProviders(PROVIDER_TYPE_PULSE);
  }

  protected addPulseDefinitionsForProvider(provider: Provider): void {
    const store = provider.store.get<PulseStore>("pulse", {});

    if (!store.define) {
      return;
    }

    Object.entries(store.define).forEach(([propertyKey, {name, ...options}]) => {
      const instance = this.injector.get(provider.token);

      const jobProcessor: Processor<never> = instance[propertyKey].bind(instance) as Processor<never>;
      const jobName = this.getNameForJob(propertyKey, store.namespace, name);

      this.define(jobName, jobProcessor, options);
    });
  }

  protected async scheduleJobsForProvider(provider: Provider<any>): Promise<void> {
    const store = provider.store.get<PulseStore>("pulse", {});

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
