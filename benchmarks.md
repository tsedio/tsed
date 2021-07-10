# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2253    | 631.53KB  | -            | -              |
| Ts.ED Koa      | 2497    | 497.54KB  | -            | -              |
| Nest-Express   | 3708    | 865.40KB  | -            | -              |
| Nest-Fastify   | 10396   | 1.74MB    | -            | -              |
| Express        | 4053    | 0.92MB    | -            | -              |
| Express Router | 3997    | 0.91MB    | -            | -              |
| Koa            | 10463   | 1.76MB    | -            | -              |
| Fastify        | 11399   | 1.91MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).