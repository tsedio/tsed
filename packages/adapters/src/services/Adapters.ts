import {Type} from "@tsed/core";
import {Constant, DI_PARAM_OPTIONS, Inject, Injectable, InjectorService} from "@tsed/di";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {Adapter} from "../domain/Adapter";

export interface InvokeAdapterOptions {
  adapter?: Type<Adapter>;

  [key: string]: any;
}

@Injectable()
export class Adapters {
  @Inject()
  injector: InjectorService;

  @Constant("adapters.Adapter", MemoryAdapter)
  protected adapter: Type<Adapter>;

  invokeAdapter<T = any>(collectionName: string, model: Type<any>, options: InvokeAdapterOptions = {}): Adapter<T> {
    const {adapter = this.adapter, ...props} = options;
    const locals = new Map();
    locals.set(DI_PARAM_OPTIONS, {...props, model, collectionName});

    return this.injector.invoke<Adapter<T>>(options.adapter, locals);
  }
}
