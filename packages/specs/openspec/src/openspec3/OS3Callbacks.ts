import {OpenSpecHash} from "../common/OpenSpecHash.js";
import {OS3Paths} from "./OS3Paths.js";
import {OS3Schema} from "./OS3Schema.js";

export type OS3Callbacks<Schema = OS3Schema> = OpenSpecHash<OpenSpecHash<OS3Paths<Schema>>>;
