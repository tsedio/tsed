# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 2555    | 715.97KB  | -            | -              |
| Ts.ED Koa      | 2741    | 546.05KB  | -            | -              |
| Nest-Express   | 4235    | 0.97MB    | -            | -              |
| Nest-Fastify   | 11784   | 1.98MB    | -            | -              |
| Express        | 4549    | 1.04MB    | -            | -              |
| Express Router | 4420    | 1.01MB    | -            | -              |
| Koa            | 11914   | 2.00MB    | -            | -              |
| Fastify        | 12556   | 2.11MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).