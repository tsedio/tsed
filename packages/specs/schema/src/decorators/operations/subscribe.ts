import {OperationVerbs} from "../../constants/OperationVerbs";
import {Operation} from "./operation";

export function Subscribe(event: string) {
  return Operation(OperationVerbs.SUBSCRIBE, event);
}
