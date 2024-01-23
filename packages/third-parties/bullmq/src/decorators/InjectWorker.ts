import {Inject} from "@tsed/common";
import {getWorkerToken} from "../utils/getWorkerToken";

export function InjectWorker(name: string) {
  return Inject(getWorkerToken(name));
}
