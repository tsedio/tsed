# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1765    | 494.60KB  | -            | -              |
| Ts.ED Koa      | 2021    | 402.68KB  | -            | -              |
| Nest-Express   | 2844    | 663.73KB  | -            | -              |
| Nest-Fastify   | 6937    | 1.16MB    | -            | -              |
| Express        | 2944    | 687.16KB  | -            | -              |
| Express Router | 2975    | 694.28KB  | -            | -              |
| Koa            | 6931    | 1.16MB    | -            | -              |
| Fastify        | 7608    | 1.28MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).