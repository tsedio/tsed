# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2216    | 621.17KB  | -            | -              |
| Ts.ED Koa      | 2408    | 479.67KB  | -            | -              |
| Nest-Express   | 3526    | 822.87KB  | -            | -              |
| Nest-Fastify   | 8192    | 1.38MB    | -            | -              |
| Express        | 3862    | 0.88MB    | -            | -              |
| Express Router | 3759    | 0.86MB    | -            | -              |
| Koa            | 9644    | 1.62MB    | -            | -              |
| Fastify        | 10131   | 1.70MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).