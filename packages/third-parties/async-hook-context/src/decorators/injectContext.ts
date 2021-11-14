import {injectProperty} from "@tsed/di";
import {isPromise} from "@tsed/core";
import {PlatformAsyncHookContext} from "../services/PlatformAsyncHookContext";

export function InjectContext(): PropertyDecorator {
  return (target: any, propertyKey: string): any | void => {
    let bean: any;

    injectProperty(target, propertyKey, {
      resolver(injector, locals, invokeOptions) {
        if (!bean) {
          bean = injector.invoke(PlatformAsyncHookContext, locals, invokeOptions);
        }

        // istanbul ignore next
        if (isPromise(bean)) {
          bean.then((result: any) => {
            bean = result;
          });
        }

        return () => (bean as PlatformAsyncHookContext).getContext();
      }
    });
  };
}
