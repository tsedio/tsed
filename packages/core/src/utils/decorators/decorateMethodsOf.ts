import {Store} from "../../domain/Store.js";
import {classOf} from "../objects/classOf.js";
import {descriptorOf} from "../objects/descriptorOf.js";
import {methodsOf} from "../objects/methodsOf.js";
import {prototypeOf} from "../objects/prototypeOf.js";

export function decorateMethodsOf(klass: any, decorator: any) {
  methodsOf(klass).forEach(({target, propertyKey}) => {
    const proto = prototypeOf(klass);

    if (target !== classOf(klass)) {
      Object.defineProperty(proto, propertyKey, {
        writable: true,
        configurable: true,
        value(...args: any[]) {
          return prototypeOf(target)[propertyKey].apply(this, args);
        }
      });

      Store.mergeStoreMethodFrom(klass, target, propertyKey);
    }

    let descriptor = descriptorOf(klass, propertyKey);

    const newDescriptor = decorator(proto, propertyKey, descriptor) || descriptor;

    if (newDescriptor) {
      Object.defineProperty(proto, propertyKey, newDescriptor);
    }
  });
}
