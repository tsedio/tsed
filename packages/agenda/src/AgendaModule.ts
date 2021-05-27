import {OnDestroy, AfterListen, Logger} from "@tsed/common";
import {Module, InjectorService, Provider, Constant, Inject} from "@tsed/di";
import {Processor} from "agenda";
import {PROVIDER_TYPE_AGENDA} from "./constants/index";
import {AgendaStore} from "./interfaces/AgendaStore";
import {AgendaService} from "./services/AgendaFactory";

@Module()
export class AgendaModule implements OnDestroy, AfterListen {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected agenda: AgendaService;

  @Constant("agenda.enabled", false)
  private loadAgenda: boolean;

  async $afterListen(): Promise<any> {
    if (this.loadAgenda) {
      const providers = this.getProviders();
      providers.forEach((provider) => this.addAgendaDefinitionsForProvider(provider));
      await this.agenda.start();
      providers.forEach((provider) => this.scheduleJobsForProvider(provider));
      this.logger.info("Agenda jobs enabled...");
    } else {
      this.logger.info("Agenda jobs disabled...");
    }
  }

  protected getProviders(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_AGENDA));
  }

  protected addAgendaDefinitionsForProvider(provider: Provider<any>): void {
    const store = provider.store.get<AgendaStore>("agenda");
    if (!store.define) {
      return;
    }

    const jobsToDefine = Object.entries(store.define);
    for (const [propertyKey, {name, ...options}] of jobsToDefine) {
      const jobProcessor: Processor = provider.instance[propertyKey].bind(provider.instance) as Processor;
      const jobName = this.getNameForJob(propertyKey, store.namespace, name);
      this.agenda.define(jobName, options, jobProcessor);
    }
  }

  protected async scheduleJobsForProvider(provider: Provider<any>): Promise<void> {
    const store = provider.store.get<AgendaStore>("agenda");
    if (!store.every) {
      return;
    }

    const jobsToSchedule = Object.entries(store.every);
    await Promise.all(
      jobsToSchedule.map(([propertyKey, {interval, name, ...options}]) => {
        const jobName = this.getNameForJob(propertyKey, store.namespace, name);
        return this.agenda.every(interval, jobName, {}, options);
      })
    );
  }

  protected getNameForJob(propertyKey: string, namespace?: string, customName?: string): string {
    const name = customName || propertyKey;
    return namespace ? `${namespace}.${name}` : name;
  }

  async $onDestroy(): Promise<any> {
    if (this.loadAgenda) {
      await this.agenda.stop();
      this.logger.info("Agenda jobs stopped...");
    }
  }
}
