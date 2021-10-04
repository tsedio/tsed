# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1472    | 412.43KB  | -            | -              |
| Ts.ED Koa      | 1648    | 328.39KB  | -            | -              |
| Nest-Express   | 2382    | 555.98KB  | -            | -              |
| Nest-Fastify   | 5125    | 0.86MB    | -            | -              |
| Express        | 2564    | 598.54KB  | -            | -              |
| Express Router | 2539    | 592.54KB  | -            | -              |
| Koa            | 5505    | 0.92MB    | -            | -              |
| Fastify        | 6028    | 1.01MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).