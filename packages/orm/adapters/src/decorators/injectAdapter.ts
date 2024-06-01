import {classOf, descriptorOf, isClass, isString, Type} from "@tsed/core";
import {Inject} from "@tsed/di";
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

export function InjectAdapter(options: AdapterInvokeOptions): PropertyDecorator;
export function InjectAdapter(model: Type<any>, options?: Partial<Omit<AdapterInvokeOptions, "client">>): PropertyDecorator;
export function InjectAdapter(
  collectionName: string,
  model: Type<any>,
  options?: Partial<Omit<AdapterInvokeOptions, "collectionName" | "client">>
): PropertyDecorator;
export function InjectAdapter(...args: any[]): PropertyDecorator {
  const options: AdapterInvokeOptions = mapOptions(args);

  return (target) => {
    Inject(Adapters)(target, "$adapters");
    const descriptor = descriptorOf(target, "$onInit");

    Reflect.defineProperty(target, "$onInit", {
      value() {
        this.adapter = (this.$adapters as Adapters).invokeAdapter(options);

        return descriptor && descriptor.value && descriptor.value.call(this);
      }
    });
  };
}
