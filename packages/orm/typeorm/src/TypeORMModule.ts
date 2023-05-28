import {ancestorsOf, isClass, Type} from "@tsed/core";
import {Configuration, InjectorService, OnDestroy, registerProvider} from "@tsed/di";
import {AbstractRepository, ConnectionOptions, ContainedType, getCustomRepository, Repository, useContainer} from "typeorm";
import {TypeORMService} from "./services/TypeORMService";

const WHITELIST = [Repository, AbstractRepository];

export class TypeORMModule implements OnDestroy {
  private settings: ConnectionOptions[];

  constructor(configuration: Configuration, private typeORMService: TypeORMService) {
    this.settings = configuration.get<ConnectionOptions[]>("typeorm", []);
  }

  init(): Promise<any> {
    const promises = this.settings.map((opts) => this.typeORMService.createConnection(opts));

    return Promise.all(promises);
  }

  $onDestroy(): Promise<any> | void {
    return this.typeORMService.closeConnections();
  }
}

function isRepository(type: Type<any>) {
  const ancestors = ancestorsOf(type);

  return (
    isClass(type) &&
    ancestors.find((ancestor) => {
      return WHITELIST.includes(ancestor);
    })
  );
}

registerProvider({
  provide: TypeORMModule,
  deps: [Configuration, TypeORMService, InjectorService],
  resolvers: [
    {
      deps: [TypeORMModule],
      get(type, options: any) {
        if (isRepository(type)) {
          try {
            return getCustomRepository(type, options.connection || "default");
          } catch (er) {
            if (process.env.NODE_ENV !== "test") {
              throw er;
            }
          }
        }
      }
    }
  ],
  injectable: false,
  async useAsyncFactory(configuration: Configuration, typeORMService: TypeORMService, injector: InjectorService) {
    useContainer(
      {
        get<T>(type: ContainedType<T>): T {
          return injector.hasProvider(type) ? injector.get<T>(type as any)! : undefined!;
        }
      },
      {fallback: true}
    );

    const typeORMModule = new TypeORMModule(configuration, typeORMService);
    await typeORMModule.init();

    return typeORMModule;
  }
});
