---
description: "Ts.ED doesn't provide solution to load configuration from files."
---
# Load configuration from file

Ts.ED doesn't provide solution to load configuration from files. Because, there is many solution to achieve this,
we consider this part as the developer responsibility.

By using [node-config](https://www.npmjs.com/package/config) or [dotenv](https://www.npmjs.com/package/dotenv), it's
possible to load your configuration from file
as following:

::: code-group

<<< @/docs/configuration/snippets/bootstrap-with-dotenv.ts [dotenv]

<<< @/docs/configuration/snippets/bootstrap-with-dotenvflow.ts [dotenv-flow]

<<< @/docs/configuration/snippets/bootstrap-with-node-config.ts [node-config]

:::
