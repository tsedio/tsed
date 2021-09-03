# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2424    | 679.41KB  | -            | -              |
| Ts.ED Koa      | 2715    | 540.98KB  | -            | -              |
| Nest-Express   | 4157    | 0.95MB    | -            | -              |
| Nest-Fastify   | 9829    | 1.65MB    | -            | -              |
| Express        | 4437    | 1.01MB    | -            | -              |
| Express Router | 4418    | 1.01MB    | -            | -              |
| Koa            | 11606   | 1.95MB    | -            | -              |
| Fastify        | 12252   | 2.06MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).