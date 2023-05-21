import {Constant, Inject, InjectorService, Module, Provider} from "@tsed/di";
import {Logger} from "@tsed/logger";
import {ListenerFn} from "eventemitter2";
import {EventEmitterStore} from "./interfaces/EventEmitterStore";
import {EventEmitterService} from "./services/EventEmitterFactory";

@Module()
export class EventEmitterModule {
  @Constant("eventEmitter.disableSummary", false)
  private disableSummary: boolean;

  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected eventEmitter: EventEmitterService;

  @Constant("eventEmitter.enabled", false)
  private loadEventEmitter: boolean;

  $onInit() {
    if (this.loadEventEmitter) {
      const providers = this.injector.getProviders();
      providers.forEach((provider) => this.bindEventListeners(provider));
    }
  }

  async $onReady(): Promise<any> {
    if (this.loadEventEmitter) {
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

    this.logger.info("EventEmitter events mounted:");

    const str = this.logger.drawTable(list, {
      padding: 1,
      header: {
        eventName: "Event name",
        listenerCount: "Number of listener"
      }
    });

    this.logger.info("\n" + str.trim());
  }

  private bindEventListeners(provider: Provider<any>) {
    this.bindOn(provider);
    this.bindOnAny(provider);
  }

  private getListener(provider: Provider<any>, propertyKey: string) {
    const instance = this.injector.get(provider.token);
    return instance[propertyKey].bind(instance) as ListenerFn;
  }

  private bindOn(provider: Provider) {
    const store = provider.store.get<EventEmitterStore | undefined>("eventEmitter");

    Object.entries(store?.onEvent || {}).forEach(([propertyKey, {event, options}]) => {
      const listenerFn = this.getListener(provider, propertyKey);

      this.eventEmitter.on(event, listenerFn, options);
    });
  }

  private bindOnAny(provider: Provider) {
    const store = provider.store.get<EventEmitterStore | undefined>("eventEmitter");

    Object.keys(store?.onAny || {}).forEach((propertyKey) => {
      const listenerFn = this.getListener(provider, propertyKey);

      this.eventEmitter.onAny(listenerFn);
    });
  }
}
