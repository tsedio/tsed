export function now() {
  return process.hrtime.bigint();
}

export function toMs(time: bigint) {
  return Math.round(Number(time) / 1000) / 1000;
}

export function fromNow(time: bigint) {
  return toMs(now() - time);
}
