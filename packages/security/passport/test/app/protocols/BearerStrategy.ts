import {Strategy} from "passport-strategy";

/**
 * Minimal stateless bearer strategy standing in for passport-jwt in the tests.
 */
export class BearerStrategy extends Strategy {
  name = "bearer";

  constructor(
    _settings: any,
    private verify: (req: any, token: string, done: (err: any, user?: any) => void) => void
  ) {
    super();
  }

  authenticate(req: any) {
    const [scheme, token] = String(req.headers.authorization || "").split(" ");

    if (scheme !== "Bearer" || !token) {
      return this.fail(401);
    }

    this.verify(req, token, (err, user) => {
      if (err) {
        return this.error(err);
      }

      return user ? this.success(user) : this.fail(401);
    });
  }
}
