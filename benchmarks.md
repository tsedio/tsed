# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2131    | 597.35KB  | -            | -              |
| Ts.ED Koa      | 2387    | 475.55KB  | -            | -              |
| Nest-Express   | 3661    | 854.56KB  | -            | -              |
| Nest-Fastify   | 9025    | 1.51MB    | -            | -              |
| Express        | 3864    | 0.88MB    | -            | -              |
| Express Router | 3827    | 0.87MB    | -            | -              |
| Koa            | 10604   | 1.78MB    | -            | -              |
| Fastify        | 11082   | 1.86MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).