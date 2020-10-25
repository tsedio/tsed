import {OpenSpecHash} from "../common/OpenSpecHash";
import {OS3Paths} from "./OS3Paths";
import {OS3Schema} from "./OS3Schema";

export type OS3Callbacks<Schema = OS3Schema> = OpenSpecHash<OpenSpecHash<OS3Paths<Schema>>>;
