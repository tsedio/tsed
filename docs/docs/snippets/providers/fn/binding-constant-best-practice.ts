class MyService {
  private value = constant<string>("envs.MY_VALUE");

  doSomething() {
    console.log(this.value);
    // your code
  }
}

injectable(MyService);

// server.ts
configuration(Server, {
  envs: {
    MY_VALUE: process.env.MY_VALUE || "myValue"
  }
});
