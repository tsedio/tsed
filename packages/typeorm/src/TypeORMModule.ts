import {Configuration, InjectorService, OnDestroy, registerProvider} from "@tsed/common";
import {ConnectionOptions, ContainedType, useContainer} from "typeorm";
import {TypeORMService} from "./services/TypeORMService";

export class TypeORMModule implements OnDestroy {
  private settings: {[key: string]: ConnectionOptions};

  constructor(configuration: Configuration, private typeORMService: TypeORMService) {
    this.settings = configuration.get<{[key: string]: ConnectionOptions}>("typeorm") || {};
  }

  async init(): Promise<any> {
    const promises = Object.keys(this.settings).map(key => this.typeORMService.createConnection(key, this.settings[key]));

    return Promise.all(promises);
  }

  $onDestroy(): Promise<any> | void {
    return this.typeORMService.closeConnections();
  }
}

registerProvider({
  provide: TypeORMModule,
  deps: [Configuration, TypeORMService, InjectorService],
  injectable: false,
  async useAsyncFactory(configuration: Configuration, typeORMService: TypeORMService, injector: InjectorService) {
    useContainer(
      {
        get<T>(type: ContainedType<T>): T {
          return injector.get<T>(type as any)!;
        }
      },
      {fallback: true}
    );

    const typeORMModule = new TypeORMModule(configuration, typeORMService);
    await typeORMModule.init();

    return typeORMModule;
  }
});
