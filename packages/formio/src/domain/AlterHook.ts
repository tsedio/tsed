export interface AlterHook<T = any> {
  transform(...args: any[]): T;
}
