import {OnDestroy, AfterListen} from "@tsed/common";
import {Module, InjectorService, Provider} from "@tsed/di";
import {PROVIDER_TYPE_AGENDA} from "./constants/index";
import {AgendaService} from "./services/AgendaService";

@Module()
export class AgendaModule implements OnDestroy, AfterListen {
  constructor(private injector: InjectorService, private agendaService: AgendaService) {}

  async $afterListen(): Promise<any> {
    const providers = this.getProviders();
    providers.forEach((provider) => this.agendaService.addAgendaDefinitionsForProvider(provider));
    await this.agendaService.getAgenda().start();
    providers.forEach((provider) => this.agendaService.scheduleJobsForProvider(provider));
  }

  protected getProviders(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_AGENDA));
  }

  $onDestroy(): Promise<any> {
    return this.agendaService.getAgenda().stop();
  }
}
