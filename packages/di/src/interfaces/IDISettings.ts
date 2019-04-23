export interface IDISettings {
  get(key: string): any;

  set(key: string, value: any): this;

  [key: string]: any;
}
