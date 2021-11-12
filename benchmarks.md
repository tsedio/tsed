# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1845    | 517.20KB  | -            | -              |
| Ts.ED Koa      | 2024    | 403.18KB  | -            | -              |
| Nest-Express   | 2947    | 687.77KB  | -            | -              |
| Nest-Fastify   | 7025    | 1.18MB    | -            | -              |
| Express        | 3200    | 746.96KB  | -            | -              |
| Express Router | 3141    | 733.02KB  | -            | -              |
| Koa            | 7358    | 1.23MB    | -            | -              |
| Fastify        | 8821    | 1.48MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).