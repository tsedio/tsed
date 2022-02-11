---
meta:
  - name: description
    content: Documentation over Command provided by Ts.ED framework. Use commands to build your CLI API.
  - name: keywords
    content: command ts.ed commander inquirer typescript node.js javascript decorators jsonschema class models
---

# Command

`@tsed/cli-core` is the npm module that provide API to create CLI. It can be to create your own CLI or to run your Ts.ED
application code. Ts.ED cli-core use [commander](https://www.npmjs.com/package/commander) to parse cli
arguments, [Inquirer](https://www.npmjs.com/package/inquirer)
to display prompt and [Listr](https://www.npmjs.com/package/listr) to run tasks.

The cli-core works as a standalone process, like the classic entry point, and will initialize a container to run your
code (Service/Provider/etc...).

1. Bootstrap (entry point e.g: `bin/index.ts`) is invoked by cli.
2. Create a headless Ts.ED Application.
3. Create command with decorator and inject service from your existing code.

## Installation

```bash
npm install @tsed/cli-core
# Or yarn
yarn add  @tsed/cli-core
```

> Note: You have to install the @tsed/cli-core

::: tip If you start your project from scratch, you can use Ts.ED cli v3 to bootstrap your project with the Command
feature.
:::

Optional. You can install the @tsed/cli in global to run your custom commands directly from the Ts.ED CLI:

```
npm install -g @tsed/cli
```

## Create the CLI entrypoint

Create `index.ts` file in `src/bin`. This file will be dedicated to bootstrap the CLI with your own configuration.

```typescript
#!/usr/bin/env node
import {CliCore} from "@tsed/cli-core";
import {config} from "../config"; // Import your application configuration
import {HelloCommand} from "./HelloCommand";

CliCore.bootstrap({
  ...config,
  // add your custom commands here
  commands: [HelloCommand]
}).catch(console.error);
```

## Create command

Use `tsed g command` to create a new Command file. Here is a basic Command example:

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";

export interface HelloCommandContext {}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {},
  options: {},
  allowUnknownOption: false
})
export class HelloCommand implements CommandProvider {
  /**
   *  Ask questions with Inquirer. Return an empty array or don't implement the method to skip this step
   */
  async $prompt(initialOptions: Partial<HelloCommandContext>): Promise<QuestionOptions> {
    return [];
  }

  /**
   * This method is called after the $prompt to create / map inputs to a proper context for the next step
   */
  $mapContext(ctx: Partial<HelloCommandContext>): HelloCommandContext {
    return {
      ...ctx
      // map something, based on ctx
    };
  }

  /**
   *  This step run your tasks with Listr module
   */
  async $exec(ctx: HelloCommandContext): Promise<any> {
    return [
      {
        title: "Do something",
        task: () => {
          console.log("HELLO");
        }
      }
    ];
  }
}
```

The `@Command` decorator allow you to bind a class to Commander. Here the previous example can be run by executing the
following command:

```bash
tsed run hello-command
```

By default, you have to give the `name` and `description`.

## Command Args

Arguments are the values given to your command without a flag option. Example:

```sh
tsed run hello-command create user
```

To bind these arguments with your custom command, you have to declare the arguments as following:

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";

export interface HelloCommandContext {
  action: "create";
  subAction: "user";
}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {
    action: {
      type: String,
      defaultValue: "create",
      description: "My action"
    },
    subAction: {
      type: String,
      defaultValue: "user",
      description: "My sub action"
    }
  },
  options: {},
  allowUnknownOption: false
})
export class HelloCommand implements CommandProvider {
  $exec(ctx: HelloCommandContext) {
    console.log(ctx);
  }
}
```

## Command Options

Options are the values given to your command with a specific flag option. Example:

```sh
tsed run hello-command -o test
```

To bind this option with your custom command, you have to declare the option as following:

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";

export interface HelloCommandContext {
  option1: string;
}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {},
  options: {
    "-o, --opt-1 <option1>": {
      type: String,
      defaultValue: "dev",
      description: "My option"
    }
  },
  allowUnknownOption: false
})
export class HelloCommand implements CommandProvider {
  $exec(ctx: HelloCommandContext) {
    console.log(ctx);
  }
}
```

## Allow extra options

By default, commander doesn't accept unknown options. You can change this behaviour, by change the `allowUnknownOption`
to `true`.

Then you'll be able to get all `args` and `options` in the `rawArgs` property:

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";

export interface HelloCommandContext {
  rawArgs: string[];
}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {},
  options: {},
  allowUnknownOption: true
})
export class HelloCommand implements CommandProvider {
  $exec(ctx: HelloCommandContext) {
    console.log(ctx);
  }
}
```

## Inject service

Use the @@Inject@@ decorator to inject your service in a command:

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";
import {MyService} from "../services/MyService";

export interface HelloCommandContext {
  rawArgs: string[];
}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {},
  options: {},
  allowUnknownOption: false
})
export class HelloCommand implements CommandProvider {
  @Inject()
  myService: MyService;

  async $exec(ctx: HelloCommandContext): Promise<any> {
    return [
      {
        title: "Update something",
        task: () => this.myService.update(ctx)
      }
    ];
  }
}
```

## Prompt

You can implement the `$prompt` method to provide a CLI prompt to your consumer. Prompt is based
on [Inquirer](https://www.npmjs.com/package/inquirer).

```typescript
import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";
import {MyService} from "../services/MyService";

export interface HelloCommandContext {
  projectName: string;
}

@Command({
  name: "hello-command",
  description: "Command description",
  args: {},
  options: {}
})
export class HelloCommand implements CommandProvider {
  @Inject()
  myService: MyService;

  async $prompt(initialOptions: Partial<HelloCommandContext>): Promise<QuestionOptions> {
    return [
      {
        type: "input",
        name: "projectName",
        message: "What is your project name",
        transformer(input) {
          return paramCase(input);
        }
      }
    ];
  }

  async $exec(ctx: HelloCommandContext): Promise<any> {
    console.log(ctx);
  }
}
```

See [Inquirer](https://www.npmjs.com/package/inquirer) for more details to create prompt.
