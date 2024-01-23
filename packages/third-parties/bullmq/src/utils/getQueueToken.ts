export function getQueueToken(queue: string) {
  return `bullmq.queue.${queue}`;
}
