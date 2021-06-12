# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2211    | 619.80KB  | -            | -              |
| Ts.ED Koa      | 2417    | 481.49KB  | -            | -              |
| Nest-Express   | 3693    | 861.95KB  | -            | -              |
| Nest-Fastify   | 10640   | 1.79MB    | -            | -              |
| Express        | 3940    | 0.90MB    | -            | -              |
| Express Router | 3907    | 0.89MB    | -            | -              |
| Koa            | 10055   | 1.69MB    | -            | -              |
| Fastify        | 11476   | 1.93MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).