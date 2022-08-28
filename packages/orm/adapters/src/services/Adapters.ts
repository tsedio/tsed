import {Type} from "@tsed/core";
import {Constant, DI_PARAM_OPTIONS, Inject, Injectable, InjectorService} from "@tsed/di";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {Adapter, AdapterConstructorOptions} from "../domain/Adapter";

export interface AdapterInvokeOptions<T = any> extends AdapterConstructorOptions<T> {
  adapter?: Type<Adapter<T>>;
}

@Injectable()
export class Adapters {
  @Inject()
  injector: InjectorService;

  @Constant("adapters.Adapter", MemoryAdapter)
  protected adapter: Type<Adapter>;

  invokeAdapter<T = any>(options: AdapterInvokeOptions): Adapter<T> {
    const {adapter = this.adapter, ...props} = options;
    const locals = options.locals || new Map();
    locals.set(DI_PARAM_OPTIONS, props);

    return this.injector.invoke<Adapter<T>>(adapter, locals);
  }
}
