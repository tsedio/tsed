import {DataSource} from "apollo-datasource";
import {registerDataSourceService} from "../registries/DataSourceServiceRegistry";

export function DataSourceService(): ClassDecorator;
export function DataSourceService(...args: any[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): void => {
    DataSource.apply(this, args)(target);
    registerDataSourceService(target);
  };
}
