# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1716    | 480.91KB  | -            | -              |
| Ts.ED Koa      | 2021    | 402.68KB  | -            | -              |
| Nest-Express   | 2640    | 616.16KB  | -            | -              |
| Nest-Fastify   | 6376    | 1.07MB    | -            | -              |
| Express        | 2852    | 665.67KB  | -            | -              |
| Express Router | 2861    | 667.67KB  | -            | -              |
| Koa            | 6236    | 1.05MB    | -            | -              |
| Fastify        | 6850    | 1.15MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).