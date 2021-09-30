# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1451    | 406.66KB  | -            | -              |
| Ts.ED Koa      | 1692    | 337.00KB  | -            | -              |
| Nest-Express   | 2343    | 546.96KB  | -            | -              |
| Nest-Fastify   | 5030    | 864.49KB  | -            | -              |
| Express        | 2483    | 579.48KB  | -            | -              |
| Express Router | 2347    | 547.69KB  | -            | -              |
| Koa            | 5243    | 0.88MB    | -            | -              |
| Fastify        | 5751    | 0.97MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).