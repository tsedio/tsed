import {getValue} from "@tsed/core";
import {join} from "node:path";

export const ROOT_DIR = join(getValue(import.meta, "dirname", ""), "..");
