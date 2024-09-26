import type {Job} from "bullmq";

export interface JobMethods<DataType = unknown, ReturnType = unknown> {
  handle(payload: DataType, job: Job<DataType, ReturnType>): ReturnType | Promise<ReturnType>;

  jobId?(payload: DataType): string | Promise<string>;
}
