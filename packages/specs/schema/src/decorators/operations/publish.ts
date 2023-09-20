import {OperationVerbs} from "../../constants/OperationVerbs";
import {Operation} from "./operation";

export function Publish(event: string) {
  return Operation(OperationVerbs.PUBLISH, event);
}
