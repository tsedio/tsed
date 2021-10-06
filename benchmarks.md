# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1825    | 511.36KB  | -            | -              |
| Ts.ED Koa      | 2074    | 413.25KB  | -            | -              |
| Nest-Express   | 3042    | 710.09KB  | -            | -              |
| Nest-Fastify   | 8654    | 1.45MB    | -            | -              |
| Express        | 3393    | 791.93KB  | -            | -              |
| Express Router | 3309    | 772.33KB  | -            | -              |
| Koa            | 7618    | 1.28MB    | -            | -              |
| Fastify        | 9442    | 1.58MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).