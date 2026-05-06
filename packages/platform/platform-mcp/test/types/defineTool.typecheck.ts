import {Injectable} from "@tsed/di";
import {s} from "@tsed/schema";

import {Prompt} from "../../src/decorators/prompt.js";
import {Resource} from "../../src/decorators/resource.js";
import {Tool} from "../../src/decorators/tool.js";
import {definePrompt} from "../../src/fn/definePrompt.js";
import {defineResource} from "../../src/fn/defineResource.js";
import {defineTool} from "../../src/fn/defineTool.js";

defineTool({
  name: "simple",
  description: "Simple tool",
  handler(args: {query: string}) {
    const query: string = args.query;

    return {
      content: [{type: "text" as const, text: query}]
    };
  }
});

defineTool({
  name: "hello",
  description: "Greets",
  inputSchema: s
    .object({
      name: s.string().required()
    })
    .required(),
  handler({name}: {name: string}) {
    return {
      content: [{type: "text" as const, text: `Hello ${name}`}]
    };
  }
});

defineTool({
  name: "typed-args",
  inputSchema: s
    .object({
      name: s.string().required()
    })
    .required(),
  handler(args) {
    const name: string = args.name;
    // @ts-expect-error string is not assignable to number
    const invalid: number = args.name;

    return {
      content: [{type: "text" as const, text: name}]
    };
  }
});

@Injectable()
class ClassBasedTool {
  run(args: {name: string}) {
    return {
      content: [{type: "text" as const, text: args.name}]
    };
  }
}

defineTool({
  name: "class-based",
  token: ClassBasedTool,
  propertyKey: "run"
});

definePrompt({
  name: "simple-prompt",
  description: "Prompt",
  handler() {
    return {
      messages: [{role: "assistant" as const, content: {type: "text" as const, text: "Hello"}}]
    };
  }
});

definePrompt({
  name: "prompt-with-schema",
  argsSchema: s
    .object({
      city: s.string().required()
    })
    .required(),
  handler(args) {
    const city: string = args.city;
    // @ts-expect-error string is not assignable to number
    const invalid: number = args.city;

    return {
      messages: [{role: "assistant" as const, content: {type: "text" as const, text: city}}]
    };
  }
});

defineResource({
  name: "resource-read",
  uri: "tsed://docs",
  handler() {
    return {contents: []};
  }
});

@Injectable()
class DecoratorTypes {
  @Tool()
  tool({name}: {name: string}) {
    return {content: [{type: "text" as const, text: name}]};
  }

  @Prompt()
  prompt() {
    return {
      messages: [{role: "assistant" as const, content: {type: "text" as const, text: "ok"}}]
    };
  }

  @Resource("tsed://resource")
  resource() {
    return {contents: []};
  }
}
