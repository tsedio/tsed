export interface BeforeListen {
  $beforeListen(): void | Promise<any>;
}
