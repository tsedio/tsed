# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2127    | 596.22KB  | -            | -              |
| Ts.ED Koa      | 2288    | 455.79KB  | -            | -              |
| Nest-Express   | 3345    | 780.69KB  | -            | -              |
| Nest-Fastify   | 9997    | 1.68MB    | -            | -              |
| Express        | 3716    | 867.25KB  | -            | -              |
| Express Router | 3679    | 858.78KB  | -            | -              |
| Koa            | 8258    | 1.39MB    | -            | -              |
| Fastify        | 10751   | 1.80MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).