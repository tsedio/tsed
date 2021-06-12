# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1863    | 522.17KB  | -            | -              |
| Ts.ED Koa      | 1998    | 398.01KB  | -            | -              |
| Nest-Express   | 2819    | 658.06KB  | -            | -              |
| Nest-Fastify   | 7004    | 1.18MB    | -            | -              |
| Express        | 3174    | 740.70KB  | -            | -              |
| Express Router | 3042    | 709.89KB  | -            | -              |
| Koa            | 6634    | 1.11MB    | -            | -              |
| Fastify        | 7233    | 1.21MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).