import {join} from "node:path";

import {getValue} from "@tsed/core";
import getAbsoluteFSPath from "swagger-ui-dist/absolute-path.js";

export const SWAGGER_UI_DIST = getAbsoluteFSPath();
export const ROOT_DIR = join(getValue(import.meta, "dirname", ""), "..");
