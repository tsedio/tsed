export interface FormatsMethods<T extends string | number> {
  compare?: (data1: T, data2: T) => number | undefined;

  validate(data: T): boolean;
}
