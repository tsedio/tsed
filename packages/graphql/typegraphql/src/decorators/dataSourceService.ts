import {Injectable, ProviderScope} from "@tsed/di";
import {PROVIDER_TYPE_DATASOURCE_SERVICE} from "../constants";

/**
 * Create a new DataSource binded with Tsed DI.
 *
 * ```typescript
 * import { DataSourceService } from "@tsed/graphql";
 * import { RESTDataSource } from 'apollo-datasource-rest';
 *
 * @DataSourceService()
 * export class MyDataSource extends RESTDataSource {
 *    constructor() {
 *      super();
 *      this.baseURL = 'https://awesome-api.example.com';
 *    }
 *
 *    willSendRequest(request) {
 *      request.headers.set('Authorization', this.context.token);
 *    }
 *
 *    getMyData(id: string) {
 *      return this.get(`/v1/my_rest_data/${id}`);
 *    }
 * }
 * ```
 *
 * @decorator
 * @graphql
 */
export function DataSourceService(): ClassDecorator {
  return Injectable({
    type: PROVIDER_TYPE_DATASOURCE_SERVICE,
    scope: ProviderScope.INSTANCE
  });
}
