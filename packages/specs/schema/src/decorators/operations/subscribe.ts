import {Operation} from "./operation.js";
import {OperationVerbs} from "../../constants/OperationVerbs.js";

export function Subscribe(event: string) {
  return Operation(OperationVerbs.SUBSCRIBE, event);
}
