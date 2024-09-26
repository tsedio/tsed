import type {Type} from "@tsed/core";
import {cleanObject} from "@tsed/core";

export class Discriminator {
  propertyName: string;
  base: Type<any>;
  values: Map<string, Type> = new Map();
  types: Map<Type, string[]> = new Map();

  constructor({
    base,
    propertyName,
    types,
    values
  }: Partial<{base: Type<any>; propertyName: string; values: Map<string, Type<any>>; types: Map<Type, string[]>}> = {}) {
    Object.assign(
      this,
      cleanObject({
        base,
        propertyName,
        types: types ? new Map(types) : undefined,
        values: values ? new Map(values) : undefined
      })
    );
  }

  add(type: Type<string>, values: string[]) {
    values.forEach((value) => {
      this.values.set(value, type);
    });

    this.types.set(type, values);

    return this;
  }

  getType(discriminatorValue: string): Type<any> {
    return this.values.get(discriminatorValue) || this.base;
  }

  getValues(type: Type) {
    return this.types.get(type);
  }

  getDefaultValue(type: Type<any>) {
    const values = this.types.get(type);
    return values ? values[0] : undefined;
  }

  children() {
    return [...new Set([...this.types.keys()])];
  }
}
