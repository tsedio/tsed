# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2547    | 713.78KB  | -            | -              |
| Ts.ED Koa      | 2787    | 555.31KB  | -            | -              |
| Nest-Express   | 4231    | 0.96MB    | -            | -              |
| Nest-Fastify   | 11848   | 1.99MB    | -            | -              |
| Express        | 4564    | 1.04MB    | -            | -              |
| Express Router | 4525    | 1.03MB    | -            | -              |
| Koa            | 11795   | 1.98MB    | -            | -              |
| Fastify        | 12980   | 2.18MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).