# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2173    | 608.99KB  | -            | -              |
| Ts.ED Koa      | 2432    | 484.59KB  | -            | -              |
| Nest-Express   | 3601    | 840.47KB  | -            | -              |
| Nest-Fastify   | 8809    | 1.48MB    | -            | -              |
| Express        | 3852    | 0.88MB    | -            | -              |
| Express Router | 3774    | 0.86MB    | -            | -              |
| Koa            | 10321   | 1.73MB    | -            | -              |
| Fastify        | 11325   | 1.90MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).