# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1849    | 518.12KB  | -            | -              |
| Ts.ED Koa      | 2034    | 405.17KB  | -            | -              |
| Nest-Express   | 2782    | 649.27KB  | -            | -              |
| Nest-Fastify   | 6852    | 1.15MB    | -            | -              |
| Express        | 3113    | 726.51KB  | -            | -              |
| Express Router | 3065    | 715.29KB  | -            | -              |
| Koa            | 6846    | 1.15MB    | -            | -              |
| Fastify        | 7535    | 1.26MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).