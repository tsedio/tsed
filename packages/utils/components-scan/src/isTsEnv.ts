export function isTsEnv() {
  return (
    (require && require.extensions && require.extensions[".ts"]) ||
    process.env["TS_TEST"] ||
    process.env.JEST_WORKER_ID !== undefined ||
    process.env.NODE_ENV === "test"
  );
}
