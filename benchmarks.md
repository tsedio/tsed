# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2216    | 621.13KB  | -            | -              |
| Ts.ED Koa      | 2468    | 491.66KB  | -            | -              |
| Nest-Express   | 3597    | 839.55KB  | -            | -              |
| Nest-Fastify   | 8355    | 1.40MB    | -            | -              |
| Express        | 3925    | 0.89MB    | -            | -              |
| Express Router | 3826    | 0.87MB    | -            | -              |
| Koa            | 9584    | 1.61MB    | -            | -              |
| Fastify        | 11054   | 1.86MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).