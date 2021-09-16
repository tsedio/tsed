# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1731    | 485.19KB  | -            | -              |
| Ts.ED Koa      | 2105    | 419.45KB  | -            | -              |
| Nest-Express   | 2909    | 679.05KB  | -            | -              |
| Nest-Fastify   | 7150    | 1.20MB    | -            | -              |
| Express        | 3244    | 757.03KB  | -            | -              |
| Express Router | 3328    | 776.81KB  | -            | -              |
| Koa            | 7484    | 1.26MB    | -            | -              |
| Fastify        | 7896    | 1.33MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).