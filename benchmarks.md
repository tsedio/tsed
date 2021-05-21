# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2244    | 629.01KB  | -            | -              |
| Ts.ED Koa      | 2473    | 492.71KB  | -            | -              |
| Nest-Express   | 3689    | 860.93KB  | -            | -              |
| Nest-Fastify   | 10113   | 1.70MB    | -            | -              |
| Express        | 4004    | 0.91MB    | -            | -              |
| Express Router | 3959    | 0.90MB    | -            | -              |
| Koa            | 10496   | 1.76MB    | -            | -              |
| Fastify        | 11709   | 1.97MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).