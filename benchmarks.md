# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2160    | 605.27KB  | -            | -              |
| Ts.ED Koa      | 2428    | 483.70KB  | -            | -              |
| Nest-Express   | 3581    | 835.88KB  | -            | -              |
| Nest-Fastify   | 8431    | 1.42MB    | -            | -              |
| Express        | 3960    | 0.90MB    | -            | -              |
| Express Router | 3814    | 0.87MB    | -            | -              |
| Koa            | 9898    | 1.66MB    | -            | -              |
| Fastify        | 9201    | 1.54MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).