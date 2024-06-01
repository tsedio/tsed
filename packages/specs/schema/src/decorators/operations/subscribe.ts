import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {Operation} from "./operation.js";

export function Subscribe(event: string) {
  return Operation(OperationVerbs.SUBSCRIBE, event);
}
