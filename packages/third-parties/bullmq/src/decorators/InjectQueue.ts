import {Inject} from "@tsed/common";
import {getQueueToken} from "../utils/getQueueToken.js";

export function InjectQueue(name: string) {
  return Inject(getQueueToken(name));
}
