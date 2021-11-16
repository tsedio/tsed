# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1631    | 457.21KB  | -            | -              |
| Ts.ED Koa      | 1780    | 354.62KB  | -            | -              |
| Nest-Express   | 2431    | 567.39KB  | -            | -              |
| Nest-Fastify   | 5504    | 0.92MB    | -            | -              |
| Express        | 2668    | 622.75KB  | -            | -              |
| Express Router | 2684    | 626.50KB  | -            | -              |
| Koa            | 5519    | 0.93MB    | -            | -              |
| Fastify        | 5929    | 1.00MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).