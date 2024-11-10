import {refValue, injectable} from "@tsed/di";

export class MyClass {
  private myValue = refValue<string>("path.to.value");

  constructor() {
    console.log(this.myValue.value);

    this.myValue.value = "newValue";
  }
}

injectable(MyClass);

// server.ts
import {configuration} from "@tsed/di";

class Server {
}

configuration(Server, {
  path: {to: {value: "myValue"}}
})
