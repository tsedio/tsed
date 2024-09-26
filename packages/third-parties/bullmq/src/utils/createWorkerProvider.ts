import type {InjectorService} from "@tsed/di";
import type {Job, WorkerOptions} from "bullmq";
import {Worker} from "bullmq";

import {BullMQTypes} from "../constants/BullMQTypes.js";
import {getWorkerToken} from "./getWorkerToken.js";

export function createWorkerProvider(injector: InjectorService, worker: string, process: (job: Job) => any, opts: WorkerOptions) {
  const token = getWorkerToken(worker);

  return injector
    .add(token, {
      type: BullMQTypes.WORKER,
      useValue: new Worker(worker, process, opts),
      hooks: {
        $onDestroy: (worker) => worker.close()
      }
    })
    .invoke<Worker>(token);
}
