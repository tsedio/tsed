# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2645    | 741.25KB  | -            | -              |
| Ts.ED Koa      | 2927    | 583.16KB  | -            | -              |
| Nest-Express   | 4373    | 1.00MB    | -            | -              |
| Nest-Fastify   | 12584   | 2.11MB    | -            | -              |
| Express        | 4771    | 1.09MB    | -            | -              |
| Express Router | 4654    | 1.06MB    | -            | -              |
| Koa            | 12604   | 2.12MB    | -            | -              |
| Fastify        | 13641   | 2.29MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).