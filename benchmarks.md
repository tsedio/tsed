# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1649    | 462.25KB  | -            | -              |
| Ts.ED Koa      | 1826    | 363.85KB  | -            | -              |
| Nest-Express   | 2529    | 590.22KB  | -            | -              |
| Nest-Fastify   | 5233    | 0.88MB    | -            | -              |
| Express        | 2810    | 655.96KB  | -            | -              |
| Express Router | 2786    | 650.15KB  | -            | -              |
| Koa            | 6104    | 1.02MB    | -            | -              |
| Fastify        | 6002    | 1.01MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).