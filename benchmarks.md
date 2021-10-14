# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2214    | 620.43KB  | -            | -              |
| Ts.ED Koa      | 2531    | 504.15KB  | -            | -              |
| Nest-Express   | 3645    | 850.68KB  | -            | -              |
| Nest-Fastify   | 8599    | 1.44MB    | -            | -              |
| Express        | 4033    | 0.92MB    | -            | -              |
| Express Router | 3929    | 0.90MB    | -            | -              |
| Koa            | 10190   | 1.71MB    | -            | -              |
| Fastify        | 9501    | 1.59MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).