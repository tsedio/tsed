# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1812    | 507.89KB  | -            | -              |
| Ts.ED Koa      | 2230    | 444.23KB  | -            | -              |
| Nest-Express   | 2879    | 671.88KB  | -            | -              |
| Nest-Fastify   | 6640    | 1.11MB    | -            | -              |
| Express        | 3040    | 709.44KB  | -            | -              |
| Express Router | 2980    | 695.53KB  | -            | -              |
| Koa            | 6475    | 1.09MB    | -            | -              |
| Fastify        | 7525    | 1.26MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).