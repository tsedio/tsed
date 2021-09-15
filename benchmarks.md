# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2503    | 701.61KB  | -            | -              |
| Ts.ED Koa      | 2877    | 573.17KB  | -            | -              |
| Nest-Express   | 4220    | 0.96MB    | -            | -              |
| Nest-Fastify   | 12033   | 2.02MB    | -            | -              |
| Express        | 4532    | 1.03MB    | -            | -              |
| Express Router | 4443    | 1.01MB    | -            | -              |
| Koa            | 10244   | 1.72MB    | -            | -              |
| Fastify        | 12994   | 2.18MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).