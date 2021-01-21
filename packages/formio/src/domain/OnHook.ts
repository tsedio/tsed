export interface OnHook<T = any> {
  on(...args: any[]): boolean | void;
}
