<p style="text-align: center" align="center">
 <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">

   <hr />

[![Build & Release](https://github.com/tsedio/tsed/workflows/Build%20&%20Release/badge.svg)](https://github.com/tsedio/tsed/actions?query=workflow%3A%22Build+%26+Release%22)
[![PR Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/tsedio/tsed/blob/master/CONTRIBUTING.md)
[![npm version](https://badge.fury.io/js/%40tsed%2Fcommon.svg)](https://badge.fury.io/js/%40tsed%2Fcommon)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![github](https://img.shields.io/static/v1?label=Github%20sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/romakita)
[![opencollective](https://img.shields.io/static/v1?label=OpenCollective%20sponsor&message=%E2%9D%A4&logo=OpenCollective&color=%23fe8e86)](https://opencollective.com/tsed)

</div>

<div align="center">
  <a href="https://tsed.io/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tsed.io/getting-started/">Getting started</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/TsED_io">Twitter</a>
</div>

<hr />

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
