# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2532    | 709.52KB  | -            | -              |
| Ts.ED Koa      | 2816    | 560.99KB  | -            | -              |
| Nest-Express   | 4346    | 0.99MB    | -            | -              |
| Nest-Fastify   | 11657   | 1.96MB    | -            | -              |
| Express        | 4571    | 1.04MB    | -            | -              |
| Express Router | 4515    | 1.03MB    | -            | -              |
| Koa            | 11633   | 1.95MB    | -            | -              |
| Fastify        | 13080   | 2.20MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).