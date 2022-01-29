export interface BeforeInstall<Settings = any> {
  $beforeInstall(setting: Settings): Promise<Settings> | Settings | void;
}
