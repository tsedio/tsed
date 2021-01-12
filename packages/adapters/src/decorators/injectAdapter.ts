import {descriptorOf, Type} from "@tsed/core";
import {Inject} from "@tsed/di";
import {Adapters, InvokeAdapterOptions} from "../services/Adapters";

export function InjectAdapter(collectionName: string, model: Type<any>, options: InvokeAdapterOptions = {}): PropertyDecorator {
  return (target) => {
    Inject(Adapters)(target, "$adapters");
    const descriptor = descriptorOf(target, "$onInit");

    Reflect.defineProperty(target, "$onInit", {
      value() {
        this.adapter = (this.$adapters as Adapters).invokeAdapter(collectionName, model, options);

        return descriptor && descriptor.value && descriptor.value.call(this);
      }
    });
  };
}
