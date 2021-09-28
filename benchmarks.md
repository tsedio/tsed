# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1842    | 516.24KB  | -            | -              |
| Ts.ED Koa      | 2086    | 415.66KB  | -            | -              |
| Nest-Express   | 3172    | 740.36KB  | -            | -              |
| Nest-Fastify   | 8934    | 1.50MB    | -            | -              |
| Express        | 3511    | 819.55KB  | -            | -              |
| Express Router | 3367    | 785.94KB  | -            | -              |
| Koa            | 8985    | 1.51MB    | -            | -              |
| Fastify        | 8924    | 1.50MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).