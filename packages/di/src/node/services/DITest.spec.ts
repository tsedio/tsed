import {Inject, Injectable, InjectorService, registerProvider} from "../../index";
import {DITest} from "../services/DITest";

@Injectable()
export class MyService {
  @Inject("TOKEN")
  token: any;
}

registerProvider({
  provide: "TOKEN",
  useFactory() {
    return {token: "token"};
  }
});
describe("DITest", () => {
  describe("create()", () => {
    beforeEach(() =>
      DITest.create({
        imports: [
          {
            token: "TOKEN",
            use: {token: "test"}
          },
          {
            token: InjectorService, // not possible to override the injector
            use: "test"
          }
        ]
      })
    );
    afterEach(() => DITest.reset());

    it("should return a service with pre mocked dependencies", () => {
      const service = DITest.get<MyService>(MyService);

      expect(service.token).toEqual({
        token: "test"
      });
    });

    it("should return a service with pre mocked dependencies (invoke)", async () => {
      const service = await DITest.invoke<MyService>(MyService);

      expect(service.token).toEqual({
        token: "test"
      });
    });

    it("should return a service with pre mocked dependencies (invoke + mock)", async () => {
      const service = await DITest.invoke<MyService>(MyService, [
        {
          token: "TOKEN",
          use: {token: "test2"}
        }
      ]);

      expect(service.token).toEqual({
        token: "test2"
      });
    });
  });
});
