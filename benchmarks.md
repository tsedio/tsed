# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2138    | 599.27KB  | -            | -              |
| Ts.ED Koa      | 2432    | 484.54KB  | -            | -              |
| Nest-Express   | 3510    | 819.20KB  | -            | -              |
| Nest-Fastify   | 9586    | 1.61MB    | -            | -              |
| Express        | 3896    | 0.89MB    | -            | -              |
| Express Router | 3767    | 0.86MB    | -            | -              |
| Koa            | 9716    | 1.63MB    | -            | -              |
| Fastify        | 9016    | 1.51MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).