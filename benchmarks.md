# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2099    | 588.32KB  | -            | -              |
| Ts.ED Koa      | 2317    | 461.58KB  | -            | -              |
| Nest-Express   | 3459    | 807.32KB  | -            | -              |
| Nest-Fastify   | 10013   | 1.68MB    | -            | -              |
| Express        | 3863    | 0.88MB    | -            | -              |
| Express Router | 3751    | 0.85MB    | -            | -              |
| Koa            | 9965    | 1.67MB    | -            | -              |
| Fastify        | 10811   | 1.81MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).