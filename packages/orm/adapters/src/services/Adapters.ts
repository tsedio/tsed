import {Type} from "@tsed/core";
import {Inject, Injectable, InjectorService} from "@tsed/di";

import {MemoryAdapter} from "../adapters/MemoryAdapter.js";
import {Adapter, AdapterConstructorOptions} from "../domain/Adapter.js";

export interface AdapterInvokeOptions<Model = any> extends AdapterConstructorOptions<Model> {
  adapter?: Type<Adapter<Model>>;
}

@Injectable()
export class Adapters {
  @Inject()
  injector: InjectorService;

  invokeAdapter<T = any>(options: AdapterInvokeOptions): Adapter<T> {
    const {adapter = this.injector.settings.get("adapters.Adapter", MemoryAdapter), ...props} = options;

    return this.injector.invoke<Adapter<T>>(adapter, options.locals, {
      useOpts: props
    });
  }
}
