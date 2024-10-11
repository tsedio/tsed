import {Inject} from "@tsed/di";

import {getQueueToken} from "../utils/getQueueToken.js";

export function InjectQueue(name: string) {
  return Inject(getQueueToken(name));
}
