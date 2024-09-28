import {DITest, Inject, Injectable, registerProvider} from "../../index.js";

@Injectable()
export class MyService {
  id = "id";
  $onInit() {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.id = "id2";
        resolve({});
      }, 1)
    );
  }
}

describe("OnInit Invoke", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  it("should inject async factory and return resolve promise value", async () => {
    const service = await DITest.invoke<MyService>(MyService, []);

    expect(service.id).toEqual("id2");
  });
});
