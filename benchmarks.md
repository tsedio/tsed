# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1796    | 503.40KB  | -            | -              |
| Ts.ED Koa      | 2051    | 408.54KB  | -            | -              |
| Nest-Express   | 2899    | 676.55KB  | -            | -              |
| Nest-Fastify   | 6953    | 1.17MB    | -            | -              |
| Express        | 3074    | 717.53KB  | -            | -              |
| Express Router | 2935    | 684.97KB  | -            | -              |
| Koa            | 6855    | 1.15MB    | -            | -              |
| Fastify        | 7321    | 1.23MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).