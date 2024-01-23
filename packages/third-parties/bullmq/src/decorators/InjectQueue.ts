import {Inject} from "@tsed/common";
import {getQueueToken} from "../utils/getQueueToken";

export function InjectQueue(name: string) {
  return Inject(getQueueToken(name));
}
