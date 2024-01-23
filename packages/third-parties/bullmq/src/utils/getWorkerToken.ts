export function getWorkerToken(worker: string) {
  return `bullmq.worker.${worker}`;
}
