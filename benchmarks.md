# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1542    | 432.08KB  | -            | -              |
| Ts.ED Koa      | 1645    | 327.70KB  | -            | -              |
| Nest-Express   | 2205    | 514.71KB  | -            | -              |
| Nest-Fastify   | 5079    | 0.85MB    | -            | -              |
| Express        | 2547    | 594.48KB  | -            | -              |
| Express Router | 2568    | 599.41KB  | -            | -              |
| Koa            | 4678    | 804.03KB  | -            | -              |
| Fastify        | 5147    | 0.86MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).