import {defineOperationApi as oDefineOperationApi} from "@directus/extensions-sdk";

import {wrapOperation} from "./wrapOperation.js";

type OperationApiConfig = Parameters<typeof oDefineOperationApi>[0];
type OperationApiResult = ReturnType<typeof oDefineOperationApi>;

/**
 * Defines a Directus operation with Ts.ED dependency injection support.
 *
 * This function wraps the Directus SDK's `defineOperationApi` to automatically integrate
 * Ts.ED's DI container, allowing you to use `inject()` to access services within your
 * operation handlers. Operations are custom logic that can be used in Directus flows.
 *
 * ### Basic operation with service injection
 *
 * ```ts
 * import {defineOperationApi} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * type SendEmailOptions = {
 *   to: string;
 *   subject: string;
 *   body: string;
 * };
 *
 * export default defineOperationApi<SendEmailOptions>({
 *   id: "send-email",
 *   handler: async (options, context) => {
 *     const emailService = inject(EmailService);
 *
 *     await emailService.send({
 *       to: options.to,
 *       subject: options.subject,
 *       body: options.body
 *     });
 *
 *     return {
 *       success: true,
 *       sentAt: new Date().toISOString()
 *     };
 *   }
 * });
 * ```
 *
 * ### Operation with external API call
 *
 * ```ts
 * import {defineOperationApi} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * type WebhookOptions = {
 *   url: string;
 *   method: "GET" | "POST";
 *   payload?: Record<string, any>;
 * };
 *
 * export default defineOperationApi<WebhookOptions>({
 *   id: "call-webhook",
 *   handler: async (options, context) => {
 *     const httpClient = inject(HttpClient);
 *
 *     const response = await httpClient.request({
 *       url: options.url,
 *       method: options.method,
 *       data: options.payload
 *     });
 *
 *     return {
 *       statusCode: response.status,
 *       data: response.data
 *     };
 *   }
 * });
 * ```
 *
 * ### Operation with database access
 *
 * ```ts
 * import {defineOperationApi} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * type CalculateStatsOptions = {
 *   collection: string;
 *   field: string;
 * };
 *
 * export default defineOperationApi<CalculateStatsOptions>({
 *   id: "calculate-stats",
 *   handler: async (options, context) => {
 *     const statsService = inject(StatsService);
 *     const directusContext = inject(DirectusContextService);
 *
 *     const itemsService = await directusContext.getItemsService(options.collection);
 *     const items = await itemsService.readByQuery({ limit: -1 });
 *
 *     const stats = statsService.calculate(items, options.field);
 *
 *     return {
 *       count: items.length,
 *       average: stats.avg,
 *       min: stats.min,
 *       max: stats.max
 *     };
 *   }
 * });
 * ```
 *
 * @template Options - Type definition for the operation's configuration options
 *
 * @param config - The operation configuration containing:
 *   - `id` - Unique identifier for the operation
 *   - `handler` - Function that executes the operation logic
 *
 * @returns The configured operation ready to be exported from your extension file
 * @see {@link wrapOperation} for the underlying wrapper implementation
 * @see {@link DirectusContextService} to access Directus context
 * @see {@link https://docs.directus.io/extensions/operations.html} Directus Operations Documentation
 */
export function defineOperationApi(config: OperationApiConfig): OperationApiResult {
  return oDefineOperationApi({
    ...config,
    handler: wrapOperation(config.handler as any)
  } as OperationApiConfig);
}
