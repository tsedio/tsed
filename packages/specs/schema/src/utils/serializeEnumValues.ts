import {isObject, uniq} from "@tsed/core";

export const serializeEnum = (enumValue: any) => {
  if (isObject(enumValue) && enumValue !== null) {
    return Object.entries(enumValue).reduce((acc: any, [key, value]: any) => {
      if (isNaN(+key)) {
        return acc.concat(value);
      }

      return acc;
    }, []);
  }

  return enumValue;
};

const transformTsEnum = (enumValue: any) => {
  return Object.keys(enumValue).reduce((acc: any, key: any) => {
    if (isNaN(+key)) {
      const value = enumValue[key];

      return acc.concat(value);
    }

    return acc;
  }, []);
};

export function serializeEnumValues(enumValues: any[]) {
  const values = enumValues.reduce((acc, value) => acc.concat(serializeEnum(value)), []);

  const getValue = (value: any) => {
    return value === null ? "null" : typeof value;
  };

  const types = values.reduce((set: Set<any>, value: any) => set.add(getValue(value)), new Set());

  return {values: uniq(values), types};
}
