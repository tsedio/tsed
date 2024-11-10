import {Configuration, Constant, Injectable} from "@tsed/di";

@Injectable()
class MyService {
  @Constant("envs.MY_VALUE")
  private value: string;

  doSomething() {
    console.log(this.value);
    // your code
  }
}

// server.ts
@Configuration({
  envs: {
    MY_VALUE: process.env.MY_VALUE || "myValue"
  }
})
class Server {
}
