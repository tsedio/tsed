import {classOf, isClass, isString, Type} from "@tsed/core";
import {Inject, inject} from "@tsed/di";

import type {Adapter} from "../domain/Adapter.js";
import {AdapterInvokeOptions, Adapters} from "../services/Adapters.js";

function mapOptions(args: any[]): AdapterInvokeOptions {
  return args.reduce((options: AdapterInvokeOptions, item, index) => {
    if (isString(item)) {
      return {
        ...options,
        collectionName: item
      };
    }

    if (isClass(item) && classOf(item) !== Object) {
      return {
        ...options,
        model: item
      };
    }

    return {...options, ...item};
  }, {});
}

export function adapter<Model>(options: AdapterInvokeOptions<Model>): Adapter<Model>;
export function adapter<Model>(model: Type<Model>, options?: Partial<Omit<AdapterInvokeOptions, "client">>): Adapter<Model>;
export function adapter<Model>(
  collectionName: string,
  model: Type<Model>,
  options?: Partial<Omit<AdapterInvokeOptions, "collectionName" | "client">>
): Adapter<Model>;
export function adapter(...args: any[]) {
  const options: AdapterInvokeOptions = mapOptions(args);
  const adapters = inject(Adapters);

  return adapters.invokeAdapter(options);
}

/**
 * Inject the adapter in the property.
 * @param options
 * @constructor
 */
export function InjectAdapter(options: AdapterInvokeOptions): PropertyDecorator;
export function InjectAdapter(model: Type<any>, options?: Partial<Omit<AdapterInvokeOptions, "client">>): PropertyDecorator;
export function InjectAdapter(
  collectionName: string,
  model: Type<any>,
  options?: Partial<Omit<AdapterInvokeOptions, "collectionName" | "client">>
): PropertyDecorator;
export function InjectAdapter(...args: any[]): PropertyDecorator {
  const options: AdapterInvokeOptions = mapOptions(args);
  const symbol = Symbol();

  return Inject(Adapters, {
    transform: (adapters: Adapters, {self}) => {
      return (self[symbol] = self[symbol] || adapters.invokeAdapter(options));
    }
  });
}
