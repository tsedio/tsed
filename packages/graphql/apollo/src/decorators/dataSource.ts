import {StoreSet, useDecorators} from "@tsed/core";
import {Injectable, ProviderScope} from "@tsed/di";

import {DATASOURCES_PROVIDERS} from "../constants/constants.js";

/**
 * Create a new injectable DataSource.
 *
 * ```typescript
 * import { DataSourceService } from "@tsed/graphql";
 * import { RESTDataSource } from '@apollo/datasource-rest';
 *
 * @DataSource()
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
export function DataSource(name?: string): ClassDecorator {
  return useDecorators(
    Injectable({
      type: DATASOURCES_PROVIDERS,
      scope: ProviderScope.INSTANCE
    }),
    StoreSet(DATASOURCES_PROVIDERS, {name})
  );
}

/**
 * Create a new injectable DataSource.
 *
 * ```typescript
 * import { DataSourceService } from "@tsed/graphql";
 * import { RESTDataSource } from '@apollo/datasource-rest';
 *
 * @DataSource()
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
export const DataSourceService = DataSource;
