export function getJobToken(queue: string, name: string) {
  return `bullmq.job.${queue}.${name}`;
}

export function getFallbackJobToken(queue?: string) {
  return ["bullmq.fallback-job", queue].filter(Boolean).join(".");
}
