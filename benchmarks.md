# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2097    | 587.60KB  | -            | -              |
| Ts.ED Koa      | 2419    | 481.89KB  | -            | -              |
| Nest-Express   | 3512    | 819.66KB  | -            | -              |
| Nest-Fastify   | 8410    | 1.41MB    | -            | -              |
| Express        | 3870    | 0.88MB    | -            | -              |
| Express Router | 3780    | 0.86MB    | -            | -              |
| Koa            | 10114   | 1.70MB    | -            | -              |
| Fastify        | 11128   | 1.87MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).