import {inject, injectable} from "@tsed/di";
import {Job, Worker, WorkerOptions} from "bullmq";

import {BullMQTypes} from "../constants/BullMQTypes.js";
import {getWorkerToken} from "./getWorkerToken.js";

export function createWorkerProvider(worker: string, process: (job: Job) => any, opts: WorkerOptions) {
  const token = getWorkerToken(worker);

  injectable(token)
    .type(BullMQTypes.WORKER)
    .value(new Worker(worker, process, opts))
    .hooks({
      $onDestroy: (worker: Worker) => worker.close()
    });

  return inject<Worker>(token);
}
