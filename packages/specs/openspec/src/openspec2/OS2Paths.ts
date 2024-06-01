import {OpenSpecPath} from "../common/OpenSpecPath.js";
import {OpenSpecRef} from "../common/OpenSpecRef.js";
import {OS2Operation} from "./OS2Operation.js";
import {OS2Parameter} from "./OS2Parameter.js";

export interface OS2Paths extends OpenSpecPath<OS2Operation> {
  parameters?: (OS2Parameter | OpenSpecRef)[];
}
