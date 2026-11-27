import autocannon from "autocannon";

function load(baseUrl, route, {connections, duration}) {
  return autocannon({
    url: baseUrl + route.path,
    method: route.method,
    headers: route.headers,
    body: route.body,
    connections,
    pipelining: 1,
    duration
  });
}

/**
 * Measures one route of a running server: a warmup (not counted), then the measured window.
 * The server CPU time is read over IPC just before and just after the measured window.
 */
export async function measureRoute(server, route, {connections, duration, warmup}) {
  if (warmup > 0) {
    await load(server.baseUrl, route, {connections, duration: warmup});
  }

  const before = await server.cpuUsage();
  const result = await load(server.baseUrl, route, {connections, duration});
  const after = await server.cpuUsage();

  const requests = result.requests.total;
  const cpuMicros = after.user - before.user + (after.system - before.system);

  return {
    rps: result.requests.average,
    p50: result.latency.p50,
    p99: result.latency.p99,
    requests,
    errors: result.errors + result.timeouts + result.non2xx,
    cpuPerRequest: requests ? cpuMicros / requests : null
  };
}
