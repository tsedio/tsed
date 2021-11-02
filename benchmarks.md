# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2152    | 603.07KB  | -            | -              |
| Ts.ED Koa      | 2396    | 477.35KB  | -            | -              |
| Nest-Express   | 3406    | 795.04KB  | -            | -              |
| Nest-Fastify   | 9370    | 1.57MB    | -            | -              |
| Express        | 3739    | 0.85MB    | -            | -              |
| Express Router | 3706    | 864.99KB  | -            | -              |
| Koa            | 9343    | 1.57MB    | -            | -              |
| Fastify        | 9953    | 1.67MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).