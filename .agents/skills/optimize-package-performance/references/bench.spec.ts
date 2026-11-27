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

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return !!value && typeof (value as any).then === "function";
}

// A scenario returning a promise is awaited on every call, so the time covers its completion
// and two calls never overlap. A synchronous scenario keeps a plain loop, without await overhead.
async function bench(name: string, fn: () => unknown, durationMs = 1500) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) {
    return;
  }

  // the first call only detects the kind of scenario; awaited, so it never overlaps the warm-up
  const first = fn();
  const isAsync = isPromiseLike(first);

  if (isAsync) {
    await first;
  }

  const runBatch = isAsync
    ? async (size: number) => {
        for (let i = 0; i < size; i++) await fn();
      }
    : (size: number) => {
        for (let i = 0; i < size; i++) fn();
      };

  // warm up, so the measured loop runs optimized code
  await runBatch(2000);

  const start = process.hrtime.bigint();
  const end = start + BigInt(durationMs) * 1_000_000n;
  let now = start;
  let runs = 0;

  while (now < end) {
    await runBatch(100);
    runs += 100;
    now = process.hrtime.bigint();
  }

  const us = Number(now - start) / 1000 / runs;

  report(`BENCH ${(process.env.LABEL || "").padEnd(10)} ${name.padEnd(40)} ${us.toFixed(2)} us/op`);
}

describe("perf", () => {
  it("bench", async () => {
    // Fixtures: realistic payloads, built once. Include a large list to expose O(n²) costs,
    // nested models, arrays, a Date, an untyped field and a payload without schema.
    // const orders = makeOrders(20);
    // const manyOrders = makeOrders(500);

    // Scenarios: call the public entry point with the options its real caller passes.
    await bench("noop", () => undefined);
    await bench("noop async", async () => undefined);
    // await bench("20 orders", () => serializer.map(orders, {type: Order}));
    // await bench("500 orders", () => serializer.map(manyOrders, {type: Order}), 3000);
  }, 300_000);
});
