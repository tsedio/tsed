# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2281    | 639.22KB  | -            | -              |
| Ts.ED Koa      | 2494    | 496.77KB  | -            | -              |
| Nest-Express   | 3818    | 0.87MB    | -            | -              |
| Nest-Fastify   | 9877    | 1.66MB    | -            | -              |
| Express        | 4234    | 0.96MB    | -            | -              |
| Express Router | 4110    | 0.94MB    | -            | -              |
| Koa            | 10879   | 1.83MB    | -            | -              |
| Fastify        | 12028   | 2.02MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).