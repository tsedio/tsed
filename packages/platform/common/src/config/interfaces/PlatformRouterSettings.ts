export interface PlatformRouterSettings {
  appendChildrenRoutesFirst?: boolean;
}

declare global {
  namespace TsED {
    interface Configuration extends Record<string, any> {
      router?: PlatformRouterSettings;
    }
  }
}
