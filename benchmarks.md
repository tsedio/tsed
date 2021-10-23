# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2112    | 591.98KB  | -            | -              |
| Ts.ED Koa      | 2421    | 482.35KB  | -            | -              |
| Nest-Express   | 3545    | 827.34KB  | -            | -              |
| Nest-Fastify   | 9953    | 1.67MB    | -            | -              |
| Express        | 3878    | 0.88MB    | -            | -              |
| Express Router | 3739    | 0.85MB    | -            | -              |
| Koa            | 9615    | 1.61MB    | -            | -              |
| Fastify        | 10539   | 1.77MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).