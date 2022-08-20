# Benchmarks

- **Machine:** darwin arm64 | 8 vCPUs | 32.0GB Mem
- **Node:** `v16.13.1`
- **Run:** Sat Aug 13 2022 18:59:16 GMT+0200 (Central European Summer Time)
- **Method:** `autocannon -c 100 -d 40 -p 10 localhost:3000` (two rounds; one to warm-up, one to measure)

|                             | Version | Router | Requests/s | Latency | Throughput/Mb |
| :-------------------------- | ------: | -----: | :--------: | ------: | ------------: |
| fastify                     |  3.29.1 |      ✓ |  115654.4  |    8.15 |         20.62 |
| fastify-injector            |  3.29.1 |      ✓ |  73362.9   |   13.13 |         16.72 |
| express                     |  4.18.1 |      ✓ |  25898.0   |   38.04 |          4.62 |
| express-route-prefix        |  4.18.1 |      ✓ |  25680.5   |   38.43 |          9.50 |
| express-with-middlewares    |  4.18.1 |      ✓ |  24525.5   |   40.26 |          9.12 |
| express-injector            |  4.18.1 |      ✗ |  23012.7   |   42.88 |          5.24 |
| express-injector-http-hook  |  4.18.1 |      ✗ |  16211.3   |   61.02 |          3.70 |
| express-injector-async-hook |  4.18.1 |      ✗ |  15442.4   |   64.06 |          3.52 |
| tsed-express                | 6.126.1 |      ✓ |  14232.5   |   69.56 |          2.61 |
| fastify-big-json            |  3.29.1 |      ✓ |    N/A     |     N/A |           N/A |
| koa-isomorphic-router       |   1.0.1 |      ✓ |    N/A     |     N/A |           N/A |
| koa-router                  |  10.1.1 |      ✓ |    N/A     |     N/A |           N/A |
| koa                         |  2.13.4 |      ✗ |    N/A     |     N/A |           N/A |
| nest-fastify                |   8.4.3 |      ✓ |    N/A     |     N/A |           N/A |
| nest                        |   8.4.3 |      ✓ |    N/A     |     N/A |           N/A |
| tsed-koa                    | 6.126.1 |      ✓ |    N/A     |     N/A |           N/A |
