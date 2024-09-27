import type {InjectorService} from "@tsed/di";
import type {QueueOptions} from "bullmq";
import {Queue} from "bullmq";

import {BullMQTypes} from "../constants/BullMQTypes.js";
import {getQueueToken} from "./getQueueToken.js";

export function createQueueProvider(injector: InjectorService, queue: string, opts: QueueOptions) {
  const token = getQueueToken(queue);

  return injector
    .add(token, {
      type: BullMQTypes.QUEUE,
      useValue: new Queue(queue, opts),
      hooks: {
        $onDestroy: (queue) => queue.close()
      }
    })
    .invoke<Queue>(token);
}
