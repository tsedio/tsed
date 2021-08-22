# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2228    | 624.39KB  | -            | -              |
| Ts.ED Koa      | 2587    | 515.36KB  | -            | -              |
| Nest-Express   | 3810    | 0.87MB    | -            | -              |
| Nest-Fastify   | 10733   | 1.80MB    | -            | -              |
| Express        | 4139    | 0.94MB    | -            | -              |
| Express Router | 3953    | 0.90MB    | -            | -              |
| Koa            | 9473    | 1.59MB    | -            | -              |
| Fastify        | 10230   | 1.72MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).