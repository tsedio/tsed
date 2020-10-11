import {Type} from "@tsed/core";

/**
 * @ignore
 */
export type GenericsMap = Map<string, Type<any>>;

/**
 * @ignore
 */
export interface GenericTypes {
  genericTypes: Type<any>[];

  [key: string]: any;
}

/**
 * @ignore
 */
export interface GenericLabels {
  genericLabels: string[];

  [key: string]: any;
}

/**
 * @ignore
 */
export interface NestedGenerics {
  nestedGenerics: Type<any>[][];

  [key: string]: any;
}

/**
 * @ignore
 */
export interface GenericsContext extends GenericTypes, GenericLabels, NestedGenerics {
  generics: GenericsMap;
}

/**
 * @ignore
 * @param genericLabels
 * @param genericTypes
 */
export function getGenericsMap(genericLabels: string[], genericTypes: Type<any>[]): GenericsMap {
  return genericLabels.reduce((map: Map<string, any>, item: string, index: number) => map.set(item, genericTypes[index]), new Map());
}

/**
 * @ignore
 * @param options
 */
export function mapGenericsOptions(options: Partial<GenericTypes & GenericLabels>) {
  if (options.genericLabels && options.genericTypes) {
    const {genericLabels, genericTypes, ...ops} = options;

    return {
      ...ops,
      generics: getGenericsMap(genericLabels, genericTypes)
    };
  }

  return options;
}

/**
 * @ignore
 * @param value
 */
export function popGenerics(value: NestedGenerics): NestedGenerics & GenericTypes {
  const [genericTypes, ...out] = value.nestedGenerics;

  return {
    genericTypes,
    nestedGenerics: out
  };
}
