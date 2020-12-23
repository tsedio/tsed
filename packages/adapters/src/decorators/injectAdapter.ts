import {descriptorOf, Type} from "@tsed/core";
import {Inject} from "@tsed/di";
import {Adapters} from "../services/Adapters";

export function InjectAdapter(collectionName: string, model: Type<any>): PropertyDecorator {
  return (target) => {
    Inject(Adapters)(target, "$adapters");
    const descriptor = descriptorOf(target, "$onInit");

    Reflect.defineProperty(target, "$onInit", {
      value() {
        this.adapter = (this.$adapters as Adapters).invokeAdapter(collectionName, model);

        return descriptor && descriptor.value && descriptor.value.call(this);
      }
    });
  };
}
