# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2099    | 588.25KB  | -            | -              |
| Ts.ED Koa      | 2303    | 458.79KB  | -            | -              |
| Nest-Express   | 3303    | 771.00KB  | -            | -              |
| Nest-Fastify   | 8726    | 1.46MB    | -            | -              |
| Express        | 3651    | 852.02KB  | -            | -              |
| Express Router | 3508    | 818.80KB  | -            | -              |
| Koa            | 9303    | 1.56MB    | -            | -              |
| Fastify        | 8591    | 1.44MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).