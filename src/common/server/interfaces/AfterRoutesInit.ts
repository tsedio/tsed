export interface AfterRoutesInit {
  $afterRoutesInit(): void | Promise<any>;
}
