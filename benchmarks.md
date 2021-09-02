# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2201    | 616.96KB  | -            | -              |
| Ts.ED Koa      | 2443    | 486.78KB  | -            | -              |
| Nest-Express   | 3608    | 842.09KB  | -            | -              |
| Nest-Fastify   | 10104   | 1.70MB    | -            | -              |
| Express        | 3972    | 0.91MB    | -            | -              |
| Express Router | 3913    | 0.89MB    | -            | -              |
| Koa            | 10129   | 1.70MB    | -            | -              |
| Fastify        | 9512    | 1.60MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).