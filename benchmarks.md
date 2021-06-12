# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1762    | 493.83KB  | -            | -              |
| Ts.ED Koa      | 1995    | 397.38KB  | -            | -              |
| Nest-Express   | 2708    | 632.03KB  | -            | -              |
| Nest-Fastify   | 6509    | 1.09MB    | -            | -              |
| Express        | 2976    | 694.56KB  | -            | -              |
| Express Router | 2930    | 683.89KB  | -            | -              |
| Koa            | 6339    | 1.06MB    | -            | -              |
| Fastify        | 6769    | 1.14MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).