import {Type} from "@tsed/core";
import {Constant, DI_PARAM_OPTIONS, Inject, Injectable, InjectorService} from "@tsed/di";
import {MemoryAdapter} from "../adapters/MemoryAdapter";
import {Adapter} from "../domain/Adapter";

@Injectable()
export class Adapters {
  @Inject()
  injector: InjectorService;

  @Constant("adapters.Adapter", MemoryAdapter)
  protected adapter: Type<Adapter>;

  invokeAdapter<T = any>(collectionName: string, model: Type<any>, adapter: Type<Adapter> = this.adapter): Adapter<T> {
    const locals = new Map();
    locals.set(DI_PARAM_OPTIONS, {model, collectionName});

    return this.injector.invoke<Adapter<T>>(adapter, locals);
  }
}
