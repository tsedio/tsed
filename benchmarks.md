# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2199    | 616.40KB  | -            | -              |
| Ts.ED Koa      | 2412    | 480.51KB  | -            | -              |
| Nest-Express   | 3590    | 837.88KB  | -            | -              |
| Nest-Fastify   | 10255   | 1.72MB    | -            | -              |
| Express        | 3951    | 0.90MB    | -            | -              |
| Express Router | 3915    | 0.89MB    | -            | -              |
| Koa            | 9180    | 1.54MB    | -            | -              |
| Fastify        | 11620   | 1.95MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).