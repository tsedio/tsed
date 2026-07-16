import {Inject, InjectorService, Module, Provider} from "@tsed/di";
import {TEMPORAL_STORE_KEY, TemporalStore} from "./interfaces/TemporalStore.js";
import {Logger} from "@tsed/logger";
import {PROVIDER_TYPE_TEMPORAL} from "./constants.js";
import {TemporalClient} from "./services/TemporalFactory.js";
import {classOf} from "@tsed/core";

@Module()
export class TemporalModule {
  @Inject()
  protected logger!: Logger;

  @Inject()
  protected injector!: InjectorService;

  @Inject()
  protected client!: TemporalClient;

  constructor(@Inject(PROVIDER_TYPE_TEMPORAL) private temporalServices: any[]) {}

  public getActivities(): object {
    return this.temporalServices.reduce((activities, instance) => Object.assign(activities, this.getActivitiesFromInstance(instance)), {});
  }

  protected getActivitiesFromInstance(instance: any) {
    const provider = this.injector.getProvider(classOf(instance))!;
    const store = provider.store.get<TemporalStore>(TEMPORAL_STORE_KEY, {});

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
