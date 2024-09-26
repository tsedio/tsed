import type {OpenSpecPath} from "../common/OpenSpecPath.js";
import type {OpenSpecRef} from "../common/OpenSpecRef.js";
import type {OS2Operation} from "./OS2Operation.js";
import type {OS2Parameter} from "./OS2Parameter.js";

export interface OS2Paths extends OpenSpecPath<OS2Operation> {
  parameters?: (OS2Parameter | OpenSpecRef)[];
}
