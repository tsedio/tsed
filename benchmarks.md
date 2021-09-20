# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1715    | 480.76KB  | -            | -              |
| Ts.ED Koa      | 2012    | 400.93KB  | -            | -              |
| Nest-Express   | 2760    | 644.25KB  | -            | -              |
| Nest-Fastify   | 6064    | 1.02MB    | -            | -              |
| Express        | 2998    | 699.79KB  | -            | -              |
| Express Router | 2956    | 690.02KB  | -            | -              |
| Koa            | 6762    | 1.13MB    | -            | -              |
| Fastify        | 7463    | 1.25MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).