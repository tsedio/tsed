# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2320    | 650.32KB  | -            | -              |
| Ts.ED Koa      | 2507    | 499.42KB  | -            | -              |
| Nest-Express   | 3692    | 861.75KB  | -            | -              |
| Nest-Fastify   | 10386   | 1.74MB    | -            | -              |
| Express        | 4096    | 0.93MB    | -            | -              |
| Express Router | 3940    | 0.90MB    | -            | -              |
| Koa            | 11231   | 1.89MB    | -            | -              |
| Fastify        | 11658   | 1.96MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).