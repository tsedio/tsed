import {Logger, OnDestroy} from "@tsed/common";
import {Constant, Inject, InjectorService, Module, Provider} from "@tsed/di";
import {PROVIDER_TYPE_TEMPORAL} from "./constants";
import {TemporalStore, TEMPORAL_STORE_KEY} from "./interfaces/TemporalStore";
import {TemporalClient} from "./services/TemporalFactory";

@Module()
export class TemporalModule implements OnDestroy {
  @Inject()
  protected logger!: Logger;

  @Inject()
  protected injector!: InjectorService;

  @Inject()
  protected client!: TemporalClient;

  @Constant("temporal.enabled", false)
  private loadTemporal!: boolean;

  async $onDestroy(): Promise<any> {
    if (this.loadTemporal) {
      await this.client.connection.close();
    }
  }

  public getActivities(): object {
    return this.getProviders().reduce((activities, provider) => Object.assign(activities, this.getActivitiesFromProvider(provider)), {});
  }

  protected getProviders(): Provider<any>[] {
    return this.injector.getProviders(PROVIDER_TYPE_TEMPORAL);
  }

  protected getActivitiesFromProvider(provider: Provider) {
    const activities = {};
    const store = provider.store.get<TemporalStore>(TEMPORAL_STORE_KEY, {});

    Object.entries(store.activities || {}).forEach(([propertyKey, {name}]) => {
      const instance = this.injector.get(provider.token);
      const jobProcessor = instance[propertyKey].bind(instance);
      const jobName = name || propertyKey;
      Object.assign(activities, {[jobName]: jobProcessor});
    });

    return activities;
  }
}
