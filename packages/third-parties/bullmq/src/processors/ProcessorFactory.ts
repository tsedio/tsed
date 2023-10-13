import {InjectorService, Service} from "@tsed/di";
import {Processor} from "bullmq";
import {JobMethods} from "../contracts/JobMethods";

@Service()
export default class ProcessorFactory {
  constructor(private readonly injector: InjectorService) {}

  public build(): Processor {
    // eslint-disable-next-line require-await
    return async (job) => {
      const j = this.injector.get<JobMethods>(`bullmq.job.${job.name}`);
      if (j === undefined) {
        return;
      }

      return j.handle(job.data);
    };
  }
}
