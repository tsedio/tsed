import {PlatformApplication, PlatformTest} from "@tsed/common";
import "../src/index";
import {PassportModule} from "./PassportModule.js";
import Passport from "passport";

vi.mock("passport");

beforeEach(() => {
  (Passport.initialize as any).mockReturnValue("initializeMiddleware");
  (Passport.session as any).mockReturnValue("sessionMiddleware");
});
describe("PassportModule", () => {
  describe("passport.session() - disabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "express",
        passport: {
          disableSession: true
        }
      })
    );
    afterEach(PlatformTest.reset);
    it("should not add the passport.session to the express application", async () => {
      const app = {
        use: vi.fn()
      };
      const passportModule = await PlatformTest.invoke<PassportModule>(PassportModule, [
        {
          token: PlatformApplication,
          use: app
        }
      ]);

      passportModule.$beforeRoutesInit();

      expect(app.use).toHaveBeenCalledWith("initializeMiddleware");
      expect(app.use).not.toHaveBeenCalledWith("sessionMiddleware");
      expect(Passport.initialize).toHaveBeenCalledWith({userProperty: undefined});
    });
  });

  describe("passport.session() - enabled", () => {
    beforeEach(() =>
      PlatformTest.create({
        PLATFORM_NAME: "express",
        passport: {
          disableSession: false
        }
      })
    );
    afterEach(PlatformTest.reset);

    it("should add the passport.session to the express application", async () => {
      const app = {
        use: vi.fn()
      };
      const passportModule = await PlatformTest.invoke<PassportModule>(PassportModule, [
        {
          token: PlatformApplication,
          use: app
        }
      ]);

      passportModule.$beforeRoutesInit();

      expect(app.use).toHaveBeenCalledWith("initializeMiddleware");
      expect(app.use).toHaveBeenCalledWith("sessionMiddleware");
      expect(Passport.initialize).toHaveBeenCalledWith({userProperty: undefined});
      expect(Passport.session).toHaveBeenCalledWith({pauseStream: undefined});
    });
  });
});
