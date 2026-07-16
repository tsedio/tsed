import getAbsoluteFSPath from "swagger-ui-dist/absolute-path.js";
import {getValue} from "@tsed/core";
import {join} from "node:path";

export const SWAGGER_UI_DIST = getAbsoluteFSPath();
export const ROOT_DIR = join(getValue(import.meta, "dirname", ""), "..");
