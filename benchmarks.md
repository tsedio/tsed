# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2099    | 588.35KB  | -            | -              |
| Ts.ED Koa      | 2381    | 474.30KB  | -            | -              |
| Nest-Express   | 3442    | 803.38KB  | -            | -              |
| Nest-Fastify   | 9537    | 1.60MB    | -            | -              |
| Express        | 3705    | 864.69KB  | -            | -              |
| Express Router | 3561    | 831.07KB  | -            | -              |
| Koa            | 10030   | 1.68MB    | -            | -              |
| Fastify        | 11428   | 1.92MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).