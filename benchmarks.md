# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1698    | 475.92KB  | -            | -              |
| Ts.ED Koa      | 1905    | 379.47KB  | -            | -              |
| Nest-Express   | 2625    | 612.57KB  | -            | -              |
| Nest-Fastify   | 6622    | 1.11MB    | -            | -              |
| Express        | 2896    | 675.86KB  | -            | -              |
| Express Router | 2827    | 659.80KB  | -            | -              |
| Koa            | 6737    | 1.13MB    | -            | -              |
| Fastify        | 7178    | 1.20MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).