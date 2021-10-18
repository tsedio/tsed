# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1507    | 422.37KB  | -            | -              |
| Ts.ED Koa      | 1672    | 333.13KB  | -            | -              |
| Nest-Express   | 2428    | 566.69KB  | -            | -              |
| Nest-Fastify   | 5674    | 0.95MB    | -            | -              |
| Express        | 2691    | 628.17KB  | -            | -              |
| Express Router | 2532    | 590.92KB  | -            | -              |
| Koa            | 6012    | 1.01MB    | -            | -              |
| Fastify        | 6382    | 1.07MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).