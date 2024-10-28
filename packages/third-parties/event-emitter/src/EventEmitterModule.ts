import {Constant, Inject, InjectorService, LOGGER, Module, Provider} from "@tsed/di";
import type {ListenerFn} from "eventemitter2";

import {EventEmitterStore} from "./interfaces/EventEmitterStore.js";
import {EventEmitterService} from "./services/EventEmitterFactory.js";

@Module()
export class EventEmitterModule {
  @Inject(LOGGER)
  protected logger: LOGGER;

  @Inject()
  protected injector: InjectorService;

  @Inject()
  protected eventEmitter: EventEmitterService;

  @Constant("eventEmitter.disableSummary", false)
  private disableSummary: boolean;

  @Constant("eventEmitter.enabled", false)
  private loadEventEmitter: boolean;

  $onInit() {
    if (this.loadEventEmitter) {
      const providers = this.injector.getProviders();
      providers.forEach((provider) => this.bindEventListeners(provider));
    }
  }

  $onReady() {
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
