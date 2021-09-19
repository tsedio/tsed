# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1464    | 410.37KB  | -            | -              |
| Ts.ED Koa      | 1750    | 348.59KB  | -            | -              |
| Nest-Express   | 2271    | 529.99KB  | -            | -              |
| Nest-Fastify   | 4858    | 835.00KB  | -            | -              |
| Express        | 2411    | 562.69KB  | -            | -              |
| Express Router | 2347    | 547.86KB  | -            | -              |
| Koa            | 5207    | 0.87MB    | -            | -              |
| Fastify        | 5366    | 0.90MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).