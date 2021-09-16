# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2184    | 612.14KB  | -            | -              |
| Ts.ED Koa      | 2528    | 503.66KB  | -            | -              |
| Nest-Express   | 3742    | 0.85MB    | -            | -              |
| Nest-Fastify   | 9011    | 1.51MB    | -            | -              |
| Express        | 4037    | 0.92MB    | -            | -              |
| Express Router | 3947    | 0.90MB    | -            | -              |
| Koa            | 10816   | 1.82MB    | -            | -              |
| Fastify        | 11536   | 1.94MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).