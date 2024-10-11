import {Inject} from "@tsed/di";

import {getWorkerToken} from "../utils/getWorkerToken.js";

export function InjectWorker(name: string) {
  return Inject(getWorkerToken(name));
}
