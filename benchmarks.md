# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1466    | 410.77KB  | -            | -              |
| Ts.ED Koa      | 1682    | 335.08KB  | -            | -              |
| Nest-Express   | 2309    | 538.90KB  | -            | -              |
| Nest-Fastify   | 5216    | 0.88MB    | -            | -              |
| Express        | 2516    | 587.26KB  | -            | -              |
| Express Router | 2446    | 570.91KB  | -            | -              |
| Koa            | 5130    | 0.86MB    | -            | -              |
| Fastify        | 5430    | 0.91MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).