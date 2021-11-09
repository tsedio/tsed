# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1625    | 455.36KB  | -            | -              |
| Ts.ED Koa      | 1863    | 371.09KB  | -            | -              |
| Nest-Express   | 2478    | 578.34KB  | -            | -              |
| Nest-Fastify   | 5791    | 0.97MB    | -            | -              |
| Express        | 2779    | 648.65KB  | -            | -              |
| Express Router | 2695    | 629.01KB  | -            | -              |
| Koa            | 5903    | 0.99MB    | -            | -              |
| Fastify        | 6246    | 1.05MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).