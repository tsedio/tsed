import {Inject} from "@tsed/common";

import {getWorkerToken} from "../utils/getWorkerToken.js";

export function InjectWorker(name: string) {
  return Inject(getWorkerToken(name));
}
