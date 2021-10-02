# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1553    | 435.15KB  | -            | -              |
| Ts.ED Koa      | 1849    | 368.43KB  | -            | -              |
| Nest-Express   | 2436    | 568.48KB  | -            | -              |
| Nest-Fastify   | 5484    | 0.92MB    | -            | -              |
| Express        | 2670    | 623.29KB  | -            | -              |
| Express Router | 2617    | 610.77KB  | -            | -              |
| Koa            | 5525    | 0.93MB    | -            | -              |
| Fastify        | 5903    | 0.99MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).