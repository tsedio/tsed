# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1434    | 401.97KB  | -            | -              |
| Ts.ED Koa      | 1672    | 333.13KB  | -            | -              |
| Nest-Express   | 2311    | 539.46KB  | -            | -              |
| Nest-Fastify   | 4853    | 834.08KB  | -            | -              |
| Express        | 2499    | 583.15KB  | -            | -              |
| Express Router | 2417    | 564.11KB  | -            | -              |
| Koa            | 5618    | 0.94MB    | -            | -              |
| Fastify        | 5487    | 0.92MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).