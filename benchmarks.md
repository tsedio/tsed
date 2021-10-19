# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1686    | 472.42KB  | -            | -              |
| Ts.ED Koa      | 2006    | 399.56KB  | -            | -              |
| Nest-Express   | 2876    | 671.17KB  | -            | -              |
| Nest-Fastify   | 6775    | 1.14MB    | -            | -              |
| Express        | 3114    | 726.72KB  | -            | -              |
| Express Router | 3037    | 708.92KB  | -            | -              |
| Koa            | 7983    | 1.34MB    | -            | -              |
| Fastify        | 8629    | 1.45MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).