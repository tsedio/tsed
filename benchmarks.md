# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1624    | 455.03KB  | -            | -              |
| Ts.ED Koa      | 1889    | 376.37KB  | -            | -              |
| Nest-Express   | 2590    | 604.42KB  | -            | -              |
| Nest-Fastify   | 6377    | 1.07MB    | -            | -              |
| Express        | 2877    | 671.55KB  | -            | -              |
| Express Router | 2730    | 637.20KB  | -            | -              |
| Koa            | 6483    | 1.09MB    | -            | -              |
| Fastify        | 6973    | 1.17MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).