import {InjectorService, Service} from "@tsed/di";
import {JobMethods, type JobStore} from "../contracts";
import {Store, Type} from "@tsed/core";
import {Job as BullMQJob, Queue} from "bullmq";

@Service()
export class JobDispatcher {
  constructor(private readonly injector: InjectorService) {}

  // eslint-disable-next-line require-await
  public async dispatch<T extends JobMethods>(job: Type<JobMethods>, payload: Parameters<T["handle"]>[0] = {}): Promise<BullMQJob> {
    const store = Store.from(job).get<JobStore>("bullmq");

    const queue = this.injector.getMany<Queue>("bullmq:queue").find((queue) => queue.name === store.queue);

    if (!queue) {
      throw new Error(`Queue(${store.queue}) not defined`);
    }

    return queue.add(store.name, payload, store.opts);
  }
}
