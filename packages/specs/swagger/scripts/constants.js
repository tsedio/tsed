import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

// @ts-ignore
export const SWAGGER_UI_DIST = dirname(fileURLToPath(import.meta.resolve("swagger-ui-dist")));
// @ts-expect-error
export const ROOT_DIR = dirname(fileURLToPath(import.meta.url));
