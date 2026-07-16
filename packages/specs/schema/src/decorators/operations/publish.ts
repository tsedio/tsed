import {Operation} from "./operation.js";
import {OperationVerbs} from "../../constants/OperationVerbs.js";

export function Publish(event: string) {
  return Operation(OperationVerbs.PUBLISH, event);
}
