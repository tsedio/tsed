# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1739    | 487.50KB  | -            | -              |
| Ts.ED Koa      | 2001    | 398.72KB  | -            | -              |
| Nest-Express   | 2819    | 657.84KB  | -            | -              |
| Nest-Fastify   | 6832    | 1.15MB    | -            | -              |
| Express        | 3078    | 718.48KB  | -            | -              |
| Express Router | 2952    | 688.94KB  | -            | -              |
| Koa            | 6925    | 1.16MB    | -            | -              |
| Fastify        | 7742    | 1.30MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).