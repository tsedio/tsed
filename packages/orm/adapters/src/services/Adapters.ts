import {Adapter, AdapterConstructorOptions} from "../domain/Adapter.js";
import {constant, inject, injectable} from "@tsed/di";
import {MemoryAdapter} from "../adapters/MemoryAdapter.js";
import {Type} from "@tsed/core";

export interface AdapterInvokeOptions<Model = any> extends AdapterConstructorOptions<Model> {
  adapter?: Type<Adapter<Model>>;
}

export class Adapters {
  invokeAdapter<T = any>(options: AdapterInvokeOptions): Adapter<T> {
    const {adapter = constant("adapters.Adapter", MemoryAdapter), ...props} = options;

    return inject<Adapter<T>>(adapter, {
      useOpts: props
    });
  }
}

injectable(Adapters);
