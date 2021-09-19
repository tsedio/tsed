# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2503    | 701.61KB  | -            | -              |
| Ts.ED Koa      | 2928    | 583.26KB  | -            | -              |
| Nest-Express   | 4237    | 0.97MB    | -            | -              |
| Nest-Fastify   | 10197   | 1.71MB    | -            | -              |
| Express        | 4643    | 1.06MB    | -            | -              |
| Express Router | 4501    | 1.03MB    | -            | -              |
| Koa            | 12015   | 2.02MB    | -            | -              |
| Fastify        | 13040   | 2.19MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).