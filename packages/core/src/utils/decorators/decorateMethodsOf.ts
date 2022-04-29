import {Store} from "../../domain/Store";
import {classOf} from "../objects/classOf";
import {descriptorOf} from "../objects/descriptorOf";
import {methodsOf} from "../objects/methodsOf";
import {prototypeOf} from "../objects/prototypeOf";

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

    const newDescriptor = decorator(proto, propertyKey, descriptorOf(klass, propertyKey));

    if (newDescriptor) {
      Object.defineProperty(proto, propertyKey, newDescriptor);
    }
  });
}
