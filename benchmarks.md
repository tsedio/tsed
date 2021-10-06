# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1560    | 437.24KB  | -            | -              |
| Ts.ED Koa      | 1761    | 350.77KB  | -            | -              |
| Nest-Express   | 2499    | 583.23KB  | -            | -              |
| Nest-Fastify   | 5334    | 0.90MB    | -            | -              |
| Express        | 2745    | 640.59KB  | -            | -              |
| Express Router | 2647    | 617.83KB  | -            | -              |
| Koa            | 6050    | 1.02MB    | -            | -              |
| Fastify        | 6585    | 1.11MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).