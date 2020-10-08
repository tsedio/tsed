---
meta:
 - name: description
   content: Use Objection.js with Express, TypeScript and Ts.ED.
 - name: keywords
   content: ts.ed express typescript objection.js node.js javascript decorators
---
# Objecion.js
Install the dependencies:
`yarn add @tsed/objection objection knex`

Add to your server:
`import "@tsed/objection"`

Add a `knex` configuration to your TSed configuration (see: http://knexjs.org/#Installation-client for options).
E.g.:
```typescript
@Configuration({
  ...
  knex: {
    client: 'sqlite3',
    connection: ':memory:'
  }
})
```
Setup a connection provider:
```typescript
import {Configuration, registerProvider} from "@tsed/di";
import {createConnection} from "@tsed/objection";
import Knex, {Config} from "knex";

export const CONNECTION = Symbol.for("DEFAULT_CONNECTION");
export type CONNECTION = ReturnType<Knex>;

registerProvider({
  provide: CONNECTION,
  deps: [Configuration],
  async useAsyncFactory(configuration: Configuration) {
    const connectionOptions = configuration.get<Config>("knex")!;

    if (connectionOptions) {
      try {
        return createConnection(connectionOptions!);
      } catch (er) {
        console.error(er);
      }
    }

    return {};
  }
});
```

## Usage
You can use the `Entity` decorator to create your models and make them work with Objection.js. `Entity` expects the table name as its argument.

```typescript
import {Required, MinLength, MaxLength, Inject} from "@tsed/common";
import {Entity} from "@tsed/objection";
import {Model} from 'objection';

@Entity("users")
export class User extends Model {
  id: number
  @Required()
  @MinLength(1)
  @MaxLength(25)
  name: string;
}
```