import type {RepeatOptions} from "bullmq";

/**
 * Build a stable job scheduler id from the job name and its repeat settings.
 */
export function getJobSchedulerId(jobName: string, repeat: Omit<RepeatOptions, "key">): string {
  const endDate = repeat.endDate === undefined ? undefined : new Date(repeat.endDate).getTime();

  return [jobName, repeat.pattern ?? repeat.every, repeat.tz, endDate].filter((value) => value !== undefined).join(":");
}
