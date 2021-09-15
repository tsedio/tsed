# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2122    | 594.67KB  | -            | -              |
| Ts.ED Koa      | 2500    | 498.12KB  | -            | -              |
| Nest-Express   | 3547    | 827.85KB  | -            | -              |
| Nest-Fastify   | 8705    | 1.46MB    | -            | -              |
| Express        | 3911    | 0.89MB    | -            | -              |
| Express Router | 3889    | 0.89MB    | -            | -              |
| Koa            | 10168   | 1.71MB    | -            | -              |
| Fastify        | 11128   | 1.87MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).