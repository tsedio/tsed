# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1399    | 392.11KB  | -            | -              |
| Ts.ED Koa      | 1646    | 327.91KB  | -            | -              |
| Nest-Express   | 2135    | 498.30KB  | -            | -              |
| Nest-Fastify   | 4631    | 795.93KB  | -            | -              |
| Express        | 2400    | 560.19KB  | -            | -              |
| Express Router | 2305    | 538.06KB  | -            | -              |
| Koa            | 4846    | 832.98KB  | -            | -              |
| Fastify        | 5159    | 0.87MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).