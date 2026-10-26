// Micro-benchmark harness run through Vitest (its SWC transform emits the decorator metadata Ts.ED models need).
// Copy it to packages/<path>/test/zz-perf.spec.ts, fill in the fixtures and scenarios, and never commit the copy.
//
//   BENCH_OUT=/tmp/bench.txt LABEL=base npx vitest run test/zz-perf.spec.ts --coverage.enabled=false
//
// Env: BENCH_OUT (file the results are appended to, Vitest swallows console.log), LABEL (run name), ONLY (scenario filter).
import {appendFileSync} from "node:fs";

// Import what the package needs to be registered, as its own specs do, for example:
// import "../src/components/DateMapper.js";
// import {JsonSerializer} from "../src/domain/JsonSerializer.js";

function report(line: string) {
  if (process.env.BENCH_OUT) {
    appendFileSync(process.env.BENCH_OUT, line + "\n");
  }
}

function bench(name: string, fn: () => unknown, durationMs = 1500) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) {
    return;
  }

  // warm up, so the measured loop runs optimized code
  for (let i = 0; i < 2000; i++) fn();

  const start = process.hrtime.bigint();
  const end = start + BigInt(durationMs) * 1_000_000n;
  let now = start;
  let runs = 0;

  while (now < end) {
    for (let i = 0; i < 100; i++) fn();
    runs += 100;
    now = process.hrtime.bigint();
  }

  const us = Number(now - start) / 1000 / runs;

  report(`BENCH ${(process.env.LABEL || "").padEnd(8)} ${name.padEnd(40)} ${us.toFixed(2)} us/op`);
}

describe("perf", () => {
  it("bench", () => {
    // Fixtures: realistic payloads, built once. Include a large list to expose O(n²) costs,
    // nested models, arrays, a Date, an untyped field and a payload without schema.
    // const orders = makeOrders(20);
    // const manyOrders = makeOrders(500);

    // Scenarios: call the public entry point with the options its real caller passes.
    bench("noop", () => undefined);
    // bench("20 orders", () => serializer.map(orders, {type: Order}));
    // bench("500 orders", () => serializer.map(manyOrders, {type: Order}), 3000);
  }, 300_000);
});
