# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1486    | 416.39KB  | -            | -              |
| Ts.ED Koa      | 1736    | 345.83KB  | -            | -              |
| Nest-Express   | 2249    | 524.98KB  | -            | -              |
| Nest-Fastify   | 5030    | 864.60KB  | -            | -              |
| Express        | 2476    | 577.81KB  | -            | -              |
| Express Router | 2412    | 563.01KB  | -            | -              |
| Koa            | 5069    | 0.85MB    | -            | -              |
| Fastify        | 5484    | 0.92MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).