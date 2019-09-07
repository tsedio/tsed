export interface AfterListen {
  $afterListen(): void | Promise<any>;
}
