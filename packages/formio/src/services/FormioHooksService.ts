import {Inject, Injectable, InjectorService} from "@tsed/common";
import {FormioHooks} from "../domain/FormioHooks";

@Injectable()
export class FormioHooksService {
  @Inject()
  protected injector: InjectorService;

  getHooks(): FormioHooks {
    return {
      alter: this.getHooksProvider("alter"),
      on: this.getHooksProvider("on")
    };
  }

  protected getProviders(type: "alter" | "on") {
    return this.injector.getProviders(`formio:${type}`);
  }

  protected getHooksProvider(type: "alter" | "on") {
    return this.bindHooks(type, this.createHooks(type));
  }

  private createHooks(type: "alter" | "on") {
    return this.getProviders(type).reduce<Record<string, Function[]>>((hooks, provider) => {
      const instance = this.injector.invoke<any>(provider.token);
      const name = provider.store.get(`formio:${type}:name`);
      const pool: Function[] = hooks[name] || [];

      const hook = (...args: any[]) =>
        instance[type === "alter" ? "transform" : "on"](
          ...args.map((input: any) => {
            return input && input.$ctx ? input.$ctx : input;
          })
        );

      return {
        ...hooks,
        [name]: ([] as Function[]).concat(pool, hook)
      };
    }, {});
  }

  protected bindHooks(type: "alter" | "on", hooks: Record<string, Function[]>) {
    return Object.entries(hooks).reduce((newHooks, [key, pool]) => {
      const wrap = (input: any, ...args: any[]): any => {
        let last: any;

        for (const fn of pool) {
          const result = fn(input, ...args);

          if (type === "alter") {
            input = result;
          } else {
            last = result;
          }
        }

        return type === "alter" ? input : last;
      };

      return {
        ...newHooks,
        [key]: wrap
      };
    }, {});
  }
}
