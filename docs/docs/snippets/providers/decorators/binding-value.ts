import {Injectable} from "@tsed/di";

@Injectable()
export class MyClass {
  @Value("path.to.value")
  private myValue: string;

  constructor() {
    console.log(this.myValue);
  }
}

// server.ts
import {Configuration} from "@tsed/di";

@Configuration({
  path: {to: {value: "myValue"}}
})
class Server {
}
