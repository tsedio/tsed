import {IModuleOptions, Module} from "@tsed/di";

/**
 * `@ServerSettings` let you to configure quickly your server via decorator. This decorator take your configuration and merge it with the default server configuration.
 *
 * The default configuration is as follow:
 *  ```json
 *  {
 *    "rootDir": "path/to/root/project",
 *    "env": "development",
 *    "port": 8080,
 *    "httpsPort": 8000,
 *    "uploadDir": "${rootDir}/uploads",
 *    "mount": {
 *      "/rest": "${rootDir}/controllers/**\/*.js"
 * },
 * "componentsScan": [
 *     "${rootDir}/middlewares/**\/*.js",
 *     "${rootDir}/services/**\/*.js",
 *     "${rootDir}/converters/**\/*.js"
 *   ]
 * }
 * ```
 *
 * You can customize your configuration as follow:
 *
 * ```typescript
 * import {ServerLoader, ServerSettings} from "@tsed/common";
 * import Path = require("path");
 *
 * @ServerSettings({
 *     rootDir: Path.resolve(__dirname),
 *     mount: {
 *         "/rest": "${rootDir}/controllers/current/**\/*.js",
 *         "/rest/v1": [
 *           "${rootDir}/controllers/v1/users/*.js",
 *           "${rootDir}/controllers/v1/groups/*.js"
 *         ]
 *     }
 * })
 * export class Server extends ServerLoader {
 *
 * }
 *
 * ```
 *
 * @param settings
 * @returns {(target:any)=>any}
 * @decorator
 */
export function ServerSettings(settings: Partial<IModuleOptions> = {}): Function {
  return Module({...settings, root: true});
}
