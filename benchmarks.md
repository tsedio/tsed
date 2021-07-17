# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1734    | 486.07KB  | -            | -              |
| Ts.ED Koa      | 1993    | 397.11KB  | -            | -              |
| Nest-Express   | 2705    | 631.33KB  | -            | -              |
| Nest-Fastify   | 6549    | 1.10MB    | -            | -              |
| Express        | 3023    | 705.54KB  | -            | -              |
| Express Router | 2861    | 667.76KB  | -            | -              |
| Koa            | 6744    | 1.13MB    | -            | -              |
| Fastify        | 7371    | 1.24MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).