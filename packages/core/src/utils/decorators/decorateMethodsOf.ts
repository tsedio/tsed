import {classOf} from "../objects/classOf";
import {methodsOf} from "../objects/methodsOf";
import {prototypeOf} from "../objects/prototypeOf";
import {descriptorOf} from "../objects/descriptorOf";

export function decorateMethodsOf(klass: any, decorator: any) {
  methodsOf(klass).forEach(({target, propertyKey}) => {
    if (target !== classOf(klass)) {
      Object.defineProperty(prototypeOf(klass), propertyKey, {
        value(...args: any[]) {
          return prototypeOf(target)[propertyKey].apply(this, args);
        }
      });
    }

    decorator(prototypeOf(klass), propertyKey, descriptorOf(klass, propertyKey));
  });
}
