import {getValue} from "@tsed/core";
import {join} from "path";

export const ROOT_DIR = join(getValue(import.meta, "dirname", ""), "..");
