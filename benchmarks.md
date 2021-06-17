# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2602    | 729.31KB  | -            | -              |
| Ts.ED Koa      | 2831    | 564.02KB  | -            | -              |
| Nest-Express   | 4254    | 0.97MB    | -            | -              |
| Nest-Fastify   | 11732   | 1.97MB    | -            | -              |
| Express        | 4622    | 1.05MB    | -            | -              |
| Express Router | 4588    | 1.05MB    | -            | -              |
| Koa            | 10656   | 1.79MB    | -            | -              |
| Fastify        | 12306   | 2.07MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).