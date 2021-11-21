import {$log, AfterListen, Logger} from "@tsed/common";
import {Constant, Inject, InjectorService, Module, Provider} from "@tsed/di";
import {ListenerFn} from "eventemitter2";
import {EventEmitterStore} from "./interfaces/EventEmitterStore";
import {EventEmitterService} from "./services/EventEmitterFactory";

@Module()
export class EventEmitterModule implements AfterListen {
  @Constant("eventEmitter.disableSummary", false)
  disableSummary: boolean;

  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected eventEmitter: EventEmitterService;

  @Constant("eventEmitter.enabled", false)
  private loadEventEmitter: boolean;

  async $afterListen(): Promise<any> {
    if (this.loadEventEmitter) {
      const providers = this.getProviders();
      providers.forEach((provider) => this.addEventListenerForProvider(provider));
      if (!this.disableSummary) {
        this.printEvents();
      }
      this.logger.info("EventEmitter listening...");
    } else {
      this.logger.info("EventEmitter disabled...");
    }
  }

  public printEvents() {
    const list = this.eventEmitter.eventNames().map((eventName) => {
      const listenerCount = this.eventEmitter.listenerCount(eventName).toString();
      return {
        eventName,
        listenerCount
      };
    });

    this.injector.logger.info("EventEmitter events mounted:");

    const str = $log.drawTable(list, {
      padding: 1,
      header: {
        eventName: "Event name",
        listenerCount: "Number of listener"
      }
    });

    this.injector.logger.info("\n" + str.trim());
  }

  protected getProviders(): Provider<any>[] {
    return Array.from(this.injector.getProviders());
  }

  private addEventListenerForProvider(provider: Provider<any>) {
    const store = provider.store.get<EventEmitterStore | undefined>("eventEmitter");

    const eventListenerDefinitions = Object.entries(store?.onEvent || {});

    for (const [propertyKey, {event, options}] of eventListenerDefinitions) {
      const instance = this.injector.get(provider.token);

      const listenerFn: ListenerFn = instance[propertyKey].bind(instance) as ListenerFn;
      this.eventEmitter.on(event, listenerFn, options);
    }

    const anyEventListenerDefinitions = Object.keys(store?.onAny || {});
    for (const propertyKey of anyEventListenerDefinitions) {
      const instance = this.injector.get(provider.token);

      const listenerFn: ListenerFn = instance[propertyKey].bind(instance) as ListenerFn;
      this.eventEmitter.onAny(listenerFn);
    }
  }
}
