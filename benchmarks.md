# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2228    | 624.31KB  | -            | -              |
| Ts.ED Koa      | 2451    | 488.24KB  | -            | -              |
| Nest-Express   | 3636    | 848.64KB  | -            | -              |
| Nest-Fastify   | 8701    | 1.46MB    | -            | -              |
| Express        | 3946    | 0.90MB    | -            | -              |
| Express Router | 3847    | 0.88MB    | -            | -              |
| Koa            | 10301   | 1.73MB    | -            | -              |
| Fastify        | 11165   | 1.87MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).