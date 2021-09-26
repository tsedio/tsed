# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1562    | 437.71KB  | -            | -              |
| Ts.ED Koa      | 1828    | 364.10KB  | -            | -              |
| Nest-Express   | 2422    | 565.22KB  | -            | -              |
| Nest-Fastify   | 5522    | 0.93MB    | -            | -              |
| Express        | 2650    | 618.58KB  | -            | -              |
| Express Router | 2612    | 609.74KB  | -            | -              |
| Koa            | 5533    | 0.93MB    | -            | -              |
| Fastify        | 5932    | 1.00MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).