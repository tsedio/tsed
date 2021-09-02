# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1356    | 380.10KB  | -            | -              |
| Ts.ED Koa      | 1589    | 316.55KB  | -            | -              |
| Nest-Express   | 2136    | 498.55KB  | -            | -              |
| Nest-Fastify   | 4676    | 803.73KB  | -            | -              |
| Express        | 2331    | 544.10KB  | -            | -              |
| Express Router | 2302    | 537.39KB  | -            | -              |
| Koa            | 4774    | 820.48KB  | -            | -              |
| Fastify        | 5218    | 0.88MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).