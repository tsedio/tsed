import {registerDataSourceService} from "../registries/DataSourceServiceRegistry";
import {ProviderScope} from "@tsed/common";

export function DataSourceService(): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): void => {
    registerDataSourceService({provide: target, scope: ProviderScope.INSTANCE});
  };
}
