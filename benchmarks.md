# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1842    | 516.12KB  | -            | -              |
| Ts.ED Koa      | 2115    | 421.33KB  | -            | -              |
| Nest-Express   | 2825    | 659.46KB  | -            | -              |
| Nest-Fastify   | 6830    | 1.15MB    | -            | -              |
| Express        | 3107    | 725.18KB  | -            | -              |
| Express Router | 2973    | 693.95KB  | -            | -              |
| Koa            | 6662    | 1.12MB    | -            | -              |
| Fastify        | 7139    | 1.20MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).