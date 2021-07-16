# Benchmark result

tsed vs express: New benchmarks generated
tsed-koa vs koa: New benchmarks generated.

> Note: 
> Average of all diffs for Ts.ED-* so: `(0.15 + 0.14 + 0.12 + 0.12) / 4`

Details:

|                | Req/sec | Trans/sec | Req/sec DIFF | Trans/sec DIFF |
| -------------- | ------- | --------- | ------------ | -------------- |
| Ts.ED Express  | 1966    | 551.06KB  | -            | -              |
| Ts.ED Koa      | 2268    | 451.77KB  | -            | -              |
| Nest-Express   | 3153    | 735.94KB  | -            | -              |
| Nest-Fastify   | 7085    | 1.19MB    | -            | -              |
| Express        | 3160    | 737.62KB  | -            | -              |
| Express Router | 3344    | 780.44KB  | -            | -              |
| Koa            | 7538    | 1.27MB    | -            | -              |
| Fastify        | 8151    | 1.37MB    | -            | -              |

> Note:
> `req/sec DIFF` and `Trans/sec DIFF` is in comparison to the baseline on target branch (master).