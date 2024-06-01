import {OperationVerbs} from "../../constants/OperationVerbs.js";
import {Operation} from "./operation.js";

export function Publish(event: string) {
  return Operation(OperationVerbs.PUBLISH, event);
}
