# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1475    | 413.28KB  | -            | -              |
| Ts.ED Koa      | 1741    | 346.83KB  | -            | -              |
| Nest-Express   | 2453    | 572.58KB  | -            | -              |
| Nest-Fastify   | 5732    | 0.96MB    | -            | -              |
| Express        | 2614    | 610.09KB  | -            | -              |
| Express Router | 2524    | 589.08KB  | -            | -              |
| Koa            | 5326    | 0.89MB    | -            | -              |
| Fastify        | 6223    | 1.04MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).