# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1376    | 385.69KB  | -            | -              |
| Ts.ED Koa      | 1658    | 330.23KB  | -            | -              |
| Nest-Express   | 2183    | 509.59KB  | -            | -              |
| Nest-Fastify   | 4632    | 796.07KB  | -            | -              |
| Express        | 2409    | 562.31KB  | -            | -              |
| Express Router | 2341    | 546.42KB  | -            | -              |
| Koa            | 4848    | 833.19KB  | -            | -              |
| Fastify        | 4951    | 850.90KB  | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).