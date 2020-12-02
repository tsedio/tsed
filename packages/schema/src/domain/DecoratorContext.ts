import {DecoratorParameters, DecoratorTypes} from "@tsed/core";
import {pascalCase} from "change-case";
import {JsonEntityStore} from "./JsonEntityStore";

export interface DecoratorActionHandler {
  (ctx: Map<string, any>): void;
}

/**
 * @ignore
 */
export abstract class DecoratorContext<T = any> extends Map<string, any> {
  readonly methods: string[];
  protected decoratorType: DecoratorTypes;
  protected store: JsonEntityStore;
  protected actions: DecoratorActionHandler[] = [];

  addAction(cb: DecoratorActionHandler) {
    this.actions.push(cb);
    return this;
  }

  build(): T {
    const decorator: any = (...args: DecoratorParameters) => this.onInit(args, decorator);

    const wrap = (cb: any) => {
      return (...args: any[]) => {
        cb(...args);
        return decorator;
      };
    };

    const wrapKey = (key: string) => {
      return wrap((...values: any[]) => {
        key in this ? (this as any)[key](...values) : this.set(key, values[0]);
      });
    };

    this.methods.forEach((name) => {
      decorator[pascalCase(name)] = wrapKey(name);
    });

    return (decorator as unknown) as T;
  }

  toObject(): any {
    return [...this.entries()].reduce((obj, [key, value]) => {
      return {
        ...obj,
        [key]: value
      };
    }, {});
  }

  getMergedKey(key: string, defaultValue: any) {
    let value = this.get(key) || defaultValue;

    if (!value) {
      return;
    }

    if (this.decoratorType === DecoratorTypes.CLASS) {
      value = {
        ...value,
        ...(defaultValue || {})
      };
    }

    return {
      ...(defaultValue || {}),
      ...value
    };
  }

  protected abstract onInit(args: DecoratorParameters, decorator: any): void;

  protected runActions() {
    this.actions.forEach((action: any) => {
      action(this);
    });

    return this;
  }
}
