# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2855    | 800.29KB  | -            | -              |
| Ts.ED Koa      | 3103    | 618.13KB  | -            | -              |
| Nest-Express   | 4737    | 1.08MB    | -            | -              |
| Nest-Fastify   | 13090   | 2.20MB    | -            | -              |
| Express        | 4913    | 1.12MB    | -            | -              |
| Express Router | 4671    | 1.06MB    | -            | -              |
| Koa            | 12250   | 2.06MB    | -            | -              |
| Fastify        | 13747   | 2.31MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).