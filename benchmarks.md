# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1846    | 517.31KB  | -            | -              |
| Ts.ED Koa      | 2118    | 422.01KB  | -            | -              |
| Nest-Express   | 3109    | 725.62KB  | -            | -              |
| Nest-Fastify   | 7506    | 1.26MB    | -            | -              |
| Express        | 3411    | 796.02KB  | -            | -              |
| Express Router | 3347    | 781.16KB  | -            | -              |
| Koa            | 8852    | 1.49MB    | -            | -              |
| Fastify        | 8287    | 1.39MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).