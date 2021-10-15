# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1452    | 406.86KB  | -            | -              |
| Ts.ED Koa      | 1747    | 348.07KB  | -            | -              |
| Nest-Express   | 2435    | 568.25KB  | -            | -              |
| Nest-Fastify   | 5845    | 0.98MB    | -            | -              |
| Express        | 2710    | 632.60KB  | -            | -              |
| Express Router | 2701    | 630.38KB  | -            | -              |
| Koa            | 5464    | 0.92MB    | -            | -              |
| Fastify        | 6206    | 1.04MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).