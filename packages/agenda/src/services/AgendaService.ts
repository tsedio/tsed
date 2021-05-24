import {Constant, Provider, Service} from "@tsed/di";
import {OnInit} from "@tsed/common";
import {Agenda, AgendaConfig, Job, Processor} from "agenda";
import {AgendaStore} from "../interfaces/AgendaStore";

@Service()
export class AgendaService implements OnInit {
  @Constant("agenda", {})
  private settings: AgendaConfig;
  private agenda: Agenda;

  public getAgenda(): Agenda {
    return this.agenda;
  }

  $onInit(): void {
    this.agenda = new Agenda(this.settings);
  }

  public addAgendaDefinitionsForProvider(provider: Provider<any>): void {
    const store = provider.store.get<AgendaStore>("agenda");

    if (!store.define) {
      return;
    }

    const jobsToDefine = Object.entries(store.define);
    for (const [targetName, {descriptor, options}] of jobsToDefine) {
      if (typeof descriptor.value != "function") {
        continue;
      }

      const boundMethod = descriptor.value.bind(provider.instance);
      const jobProcessor: Processor = async (job: Job) => {
        if (descriptor.value && typeof descriptor.value == "function") {
          return boundMethod(job);
        }
      };

      this.agenda.define(this.getNameForJob(targetName, store.namespace, options?.name), options?.options || {}, jobProcessor);
    }
  }

  public async scheduleJobsForProvider(provider: Provider<any>): Promise<void> {
    const store = provider.store.get<AgendaStore>("agenda");
    if (!store.every) {
      return;
    }

    const jobsToSchedule = Object.entries(store.every);
    await Promise.all(
      jobsToSchedule.map(([targetName, {options}]) => {
        return this.agenda.every(options.interval, this.getNameForJob(targetName, store.namespace, options?.name), {}, options.options);
      })
    );
  }

  protected getNameForJob(targetName: string, namespace?: string, customName?: string): string {
    const name = customName || targetName;
    return namespace ? `${namespace}.${name}` : name;
  }
}
