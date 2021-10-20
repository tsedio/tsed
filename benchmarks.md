# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2186    | 612.79KB  | -            | -              |
| Ts.ED Koa      | 2524    | 502.92KB  | -            | -              |
| Nest-Express   | 3597    | 839.56KB  | -            | -              |
| Nest-Fastify   | 9716    | 1.63MB    | -            | -              |
| Express        | 3928    | 0.90MB    | -            | -              |
| Express Router | 3913    | 0.89MB    | -            | -              |
| Koa            | 9819    | 1.65MB    | -            | -              |
| Fastify        | 10643   | 1.79MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).