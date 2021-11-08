# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2185    | 612.35KB  | -            | -              |
| Ts.ED Koa      | 2377    | 473.51KB  | -            | -              |
| Nest-Express   | 3368    | 786.19KB  | -            | -              |
| Nest-Fastify   | 7872    | 1.32MB    | -            | -              |
| Express        | 3740    | 0.85MB    | -            | -              |
| Express Router | 3586    | 836.89KB  | -            | -              |
| Koa            | 7917    | 1.33MB    | -            | -              |
| Fastify        | 8610    | 1.45MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).