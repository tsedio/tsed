import type {OpenSpecHash} from "../common/OpenSpecHash.js";
import type {OS3Paths} from "./OS3Paths.js";
import type {OS3Schema} from "./OS3Schema.js";

export type OS3Callbacks<Schema = OS3Schema> = OpenSpecHash<OpenSpecHash<OS3Paths<Schema>>>;
