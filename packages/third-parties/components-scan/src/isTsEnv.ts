export function isTsEnv() {
  return (
    process.env["TS_NODE_DEV"] ||
    process.env["_"]?.includes("ts-node") ||
    process.env["TS_TEST"] ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.env.NODE_ENV === "test"
  );
}
