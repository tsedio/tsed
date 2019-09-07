export interface BeforeInit {
  $beforeInit(): void | Promise<any>;
}
