import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
import * as SwaggerUIDist from "swagger-ui-dist/absolute-path.js";

// @ts-ignore
export const SWAGGER_UI_DIST = await (SwaggerUIDist.default || SwaggerUIDist)();
// @ts-expect-error
export const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
