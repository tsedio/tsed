import {join} from "node:path";

import {getValue} from "@tsed/core";

export const ROOT_DIR = join(getValue(import.meta, "dirname", ""), "..");
