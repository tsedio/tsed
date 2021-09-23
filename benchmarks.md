# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1648    | 461.88KB  | -            | -              |
| Ts.ED Koa      | 2010    | 400.51KB  | -            | -              |
| Nest-Express   | 2534    | 591.32KB  | -            | -              |
| Nest-Fastify   | 5540    | 0.93MB    | -            | -              |
| Express        | 2834    | 661.43KB  | -            | -              |
| Express Router | 2828    | 660.11KB  | -            | -              |
| Koa            | 5932    | 1.00MB    | -            | -              |
| Fastify        | 6219    | 1.04MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).