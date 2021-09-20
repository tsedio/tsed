# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1577    | 442.13KB  | -            | -              |
| Ts.ED Koa      | 1918    | 382.20KB  | -            | -              |
| Nest-Express   | 2528    | 589.92KB  | -            | -              |
| Nest-Fastify   | 5851    | 0.98MB    | -            | -              |
| Express        | 2716    | 633.81KB  | -            | -              |
| Express Router | 2621    | 611.84KB  | -            | -              |
| Koa            | 5493    | 0.92MB    | -            | -              |
| Fastify        | 6289    | 1.06MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).