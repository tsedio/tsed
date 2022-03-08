import {classOf} from "../objects/classOf";
import {methodsOf} from "../objects/methodsOf";
import {prototypeOf} from "../objects/prototypeOf";
import {descriptorOf} from "../objects/descriptorOf";
import {Store} from "../../domain/Store";

export function decorateMethodsOf(klass: any, decorator: any) {
  methodsOf(klass).forEach(({target, propertyKey}) => {
    if (target !== classOf(klass)) {
      Object.defineProperty(prototypeOf(klass), propertyKey, {
        writable: true,
        value(...args: any[]) {
          return prototypeOf(target)[propertyKey].apply(this, args);
        }
      });

      Store.mergeStoreMethodFrom(klass, target, propertyKey);
    }

    decorator(prototypeOf(klass), propertyKey, descriptorOf(klass, propertyKey));
  });
}
