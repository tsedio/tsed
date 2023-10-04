import {Logger} from "@tsed/common";
import {Inject, InjectorService, Module, Provider} from "@tsed/di";
import {PROVIDER_TYPE_TEMPORAL} from "./constants";
import {TemporalStore, TEMPORAL_STORE_KEY} from "./interfaces/TemporalStore";
import {TemporalClient} from "./services/TemporalFactory";

@Module()
export class TemporalModule {
  @Inject()
  protected logger!: Logger;

  @Inject()
  protected injector!: InjectorService;

  @Inject()
  protected client!: TemporalClient;

  public getActivities(): object {
    return this.getProviders().reduce((activities, provider) => Object.assign(activities, this.getActivitiesFromProvider(provider)), {});
  }

  protected getProviders(): Provider<any>[] {
    return this.injector.getProviders(PROVIDER_TYPE_TEMPORAL);
  }

  protected getActivitiesFromProvider(provider: Provider) {
    const store = provider.store.get<TemporalStore>(TEMPORAL_STORE_KEY, {});
    const instance = this.injector.get(provider.token);

    return Object.entries(store.activities || {}).reduce((activities, [propertyKey, {name}]) => {
      const jobProcessor = instance[propertyKey].bind(instance);
      const jobName = name || propertyKey;

      return {
        ...activities,
        [jobName]: jobProcessor
      };
    }, {});
  }
}
