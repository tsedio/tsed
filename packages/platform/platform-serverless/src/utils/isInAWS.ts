export function isInAWS(): boolean {
  return (
    // @ts-ignore
    globalThis.awslambda !== undefined &&
    // @ts-ignore
    awslambda.streamifyResponse !== undefined
  );
}
