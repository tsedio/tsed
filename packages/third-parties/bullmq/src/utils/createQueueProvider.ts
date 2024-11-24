import {inject, injectable} from "@tsed/di";
import {Queue, QueueOptions} from "bullmq";

import {getQueueToken} from "./getQueueToken.js";

export function createQueueProvider(queue: string, opts: QueueOptions) {
  const token = getQueueToken(queue);

  injectable(token)
    .factory(() => new Queue(queue, opts))
    .hooks({
      $onDestroy: (queue: Queue) => queue.close()
    });

  return inject<Queue>(token);
}
