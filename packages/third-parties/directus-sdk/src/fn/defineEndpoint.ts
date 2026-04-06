import {defineEndpoint as oDefineEndpoint} from "@directus/extensions-sdk";

import {wrapEndpoint} from "./wrapEndpoint.js";

type EndpointConfig = Parameters<typeof oDefineEndpoint>[0];
type EndpointResult = ReturnType<typeof oDefineEndpoint>;

/**
 * Defines a Directus endpoint with Ts.ED dependency injection support.
 *
 * This function wraps the Directus SDK's `defineEndpoint` to automatically integrate
 * Ts.ED's DI container, allowing you to use `inject()` to access services within
 * your endpoint handlers. It also provides automatic error handling and logging.
 *
 * ### Basic endpoint with service injection
 * ```ts
 * import {defineEndpoint} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * export default defineEndpoint({
 *   id: "my-custom-endpoint",
 *   handler: (router) => {
 *     router.get("/hello", async (req, res) => {
 *       const myService = inject(MyService);
 *       const result = await myService.doSomething();
 *
 *       return res.json(result);
 *     });
 *   }
 * });
 * ```
 *
 * ### Function-only configuration
 *
 * ```ts
 * import {defineEndpoint} from "@tsed/directus-sdk";
 *
 * export default defineEndpoint((router, context) => {
 *   router.post("/webhook", async (req, res) => {
 *     const myService = inject(MyService);
 *     const result = await myService.doSomething();
 *     // Handle webhook
 *     res.json({ success: true });
 *   });
 * });
 * ```
 *
 * ### With multiple routes and error handling
 *
 * ```ts
 * import {defineEndpoint} from "@tsed/directus-sdk";
 * import {inject} from "@tsed/di";
 *
 * export default defineEndpoint({
 *   id: "api-v1",
 *   handler: (router) => {
 *     router.get("/users", async (req, res) => {
 *       const userService = inject(UserService);
 *       const users = await userService.findAll();
 *       res.json(users);
 *     });
 *
 *     router.post("/auth/login", async (req, res) => {
 *       const authService = inject(AuthService);
 *       const token = await authService.authenticate(req.body);
 *       res.json({ token });
 *     });
 *   }
 * });
 * ```
 * @param config - The endpoint configuration. Can be either:
 *   - A function that receives the router and context
 *   - An object with `id` and `handler` properties
 *
 * @returns The configured endpoint ready to be exported from your extension file
 * @see {@link wrapEndpoint} for the underlying wrapper implementation
 * @see {@link https://docs.directus.io/extensions/endpoints.html} Directus Endpoints Documentation
 */
export function defineEndpoint(config: EndpointConfig): EndpointResult {
  if (typeof config === "function") {
    return oDefineEndpoint(wrapEndpoint(config as any) as EndpointConfig);
  }

  return oDefineEndpoint({
    ...config,
    handler: wrapEndpoint(config.handler as any)
  } as EndpointConfig);
}
