export interface OnServerReady {
  $onServerReady(): void | Promise<any>;
}
