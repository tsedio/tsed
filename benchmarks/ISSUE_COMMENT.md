# Benchmarks

- **Machine:** darwin arm64 | 8 vCPUs | 32.0GB Mem
- **Node:** `v18.19.0`
- **Run:** Mon Feb 05 2024 07:39:14 GMT+0100 (Central European Standard Time)
- **Method:** `autocannon -c 100 -d 10 -p 10 localhost:3000` (two rounds; one to warm-up, one to measure)

|                  | Version | Router | Requests/s | Latency | Throughput/Mb |
| :--------------- | ------: | -----: | :--------: | ------: | ------------: |
| fastify          |  3.29.4 |      ✓ |  71505.5   |   13.48 |         12.75 |
| koa              |  2.13.4 |      ✗ |  60188.0   |   17.46 |         10.73 |
| nest-fastify     |   8.4.3 |      ✓ |  55904.9   |   20.59 |          9.97 |
| fastify-injector |  3.29.4 |      ✓ |  55235.2   |   17.60 |         12.59 |
| express-injector |  4.18.1 |      ✗ |  18922.9   |   52.23 |          4.31 |
| express          |  4.18.1 |      ✓ |  17795.2   |   55.56 |          3.17 |
| nest             |   8.4.3 |      ✓ |  17642.8   |   71.10 |          4.24 |
| fastify-big-json |  3.29.4 |      ✓ |  15840.7   |   62.44 |        182.26 |
| express-morgan   |  4.18.1 |      ✗ |  13839.4   |   77.28 |          2.47 |
| tsed-express     |  7.61.0 |      ✓ |    N/A     |     N/A |           N/A |
| tsed-koa         |  7.61.0 |      ✓ |    N/A     |     N/A |           N/A |

## Explanation

The benchmark shows a performance difference between the frameworks. We note that Ts.ED is often last. In fact, Ts.ED uses features useful to a production application which reduce its performance.

For example, Ts.ED initializes a sandbox (async_hook) for each request in order to work in an isolated context if necessary.
It also initializes the elements necessary for monitoring requests in a log manager.

All this at a necessary cost that reflects the reality of a production application ;)
