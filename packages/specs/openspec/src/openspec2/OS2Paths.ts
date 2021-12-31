import {OpenSpecPath} from "../common/OpenSpecPath";
import {OpenSpecRef} from "../common/OpenSpecRef";
import {OS2Operation} from "./OS2Operation";
import {OS2Parameter} from "./OS2Parameter";

/**
 * @deprecated
 */
export interface OS2Paths extends OpenSpecPath<OS2Operation> {
  parameters?: (OS2Parameter | OpenSpecRef)[];
}
