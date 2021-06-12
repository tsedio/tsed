# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2213    | 620.26KB  | -            | -              |
| Ts.ED Koa      | 2439    | 485.80KB  | -            | -              |
| Nest-Express   | 3643    | 850.28KB  | -            | -              |
| Nest-Fastify   | 10455   | 1.75MB    | -            | -              |
| Express        | 4178    | 0.95MB    | -            | -              |
| Express Router | 3966    | 0.90MB    | -            | -              |
| Koa            | 10714   | 1.80MB    | -            | -              |
| Fastify        | 11352   | 1.91MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).