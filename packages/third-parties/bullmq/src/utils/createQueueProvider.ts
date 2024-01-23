import {InjectorService} from "@tsed/di";
import {JobsOptions, Queue, QueueOptions} from "bullmq";
import {queue} from "rxjs";
import {BullMQTypes} from "../constants/BullMQTypes";
import {getQueueToken} from "./getQueueToken";

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
