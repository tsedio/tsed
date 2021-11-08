# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1373    | 384.76KB  | -            | -              |
| Ts.ED Koa      | 1557    | 310.14KB  | -            | -              |
| Nest-Express   | 2022    | 472.02KB  | -            | -              |
| Nest-Fastify   | 4097    | 704.26KB  | -            | -              |
| Express        | 2159    | 503.93KB  | -            | -              |
| Express Router | 2164    | 504.98KB  | -            | -              |
| Koa            | 4132    | 710.26KB  | -            | -              |
| Fastify        | 4578    | 786.88KB  | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).