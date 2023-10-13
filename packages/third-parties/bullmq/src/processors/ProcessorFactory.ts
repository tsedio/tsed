import {InjectorService, Service} from "@tsed/di";
import {Processor} from "bullmq";
import {Store} from "@tsed/core";
import {JobMethods} from "../contracts";
import {type JobStore} from "../contracts";

@Service()
export default class ProcessorFactory {
  constructor(private readonly injector: InjectorService) {}

  public build(): Processor {
    // eslint-disable-next-line require-await
    return async (job) => {
      const j = this.injector.getMany<JobMethods>("bullmq:job").find((j) => {
        const store = Store.from(j).get("bullmq") as JobStore;

        return store.name === job.name && store.queue === job.queueName;
      });

      if (j === undefined) {
        return;
      }

      return j.handle(job.data);
    };
  }
}
