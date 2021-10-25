# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1480    | 414.91KB  | -            | -              |
| Ts.ED Koa      | 1725    | 343.65KB  | -            | -              |
| Nest-Express   | 2220    | 518.08KB  | -            | -              |
| Nest-Fastify   | 5143    | 0.86MB    | -            | -              |
| Express        | 2456    | 573.11KB  | -            | -              |
| Express Router | 2420    | 564.93KB  | -            | -              |
| Koa            | 5138    | 0.86MB    | -            | -              |
| Fastify        | 5654    | 0.95MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).