# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1872    | 524.62KB  | -            | -              |
| Ts.ED Koa      | 1909    | 380.40KB  | -            | -              |
| Nest-Express   | 2803    | 654.27KB  | -            | -              |
| Nest-Fastify   | 6546    | 1.10MB    | -            | -              |
| Express        | 3269    | 762.94KB  | -            | -              |
| Express Router | 2836    | 661.98KB  | -            | -              |
| Koa            | 6863    | 1.15MB    | -            | -              |
| Fastify        | 7518    | 1.26MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).