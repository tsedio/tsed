# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2354    | 659.63KB  | -            | -              |
| Ts.ED Koa      | 2626    | 523.05KB  | -            | -              |
| Nest-Express   | 3745    | 0.85MB    | -            | -              |
| Nest-Fastify   | 10522   | 1.77MB    | -            | -              |
| Express        | 4062    | 0.93MB    | -            | -              |
| Express Router | 3953    | 0.90MB    | -            | -              |
| Koa            | 9295    | 1.56MB    | -            | -              |
| Fastify        | 11268   | 1.89MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).