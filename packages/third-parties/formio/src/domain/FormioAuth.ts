import {Next, Req, Res} from "@tsed/platform-http";

import {FormioDecodedToken, FormioPayloadToken} from "./FormioDecodedToken.js";
import {FormioForm} from "./FormioModels.js";

export interface FormioAuth {
  /**
   * Send the current user.
   *
   * @param req
   * @param res
   * @param next
   */
  currentUser(req: Req, res: Res, next: Function): void;

  /**
   * Checks to see if a decoded token is allowed to access this path.
   * @param req
   * @param decoded
   * @return {boolean}
   */
  isTokenAllowed(req: Req, decoded: FormioDecodedToken): boolean;

  /**
   * Generate our JWT with the given payload, and pass it to the given callback function.
   *
   * @param payload {Object}
   *   The decoded JWT.
   *
   * @return {String|Boolean}
   *   The JWT from the given payload, or false if the jwt payload is still valid.
   */
  getToken(payload: FormioPayloadToken): string | boolean;

  /**
   * Generate a temporary token for a specific path and expiration.
   *
   * @param req
   * @param res
   * @param allow
   * @param expire
   * @param admin
   * @param cb
   */
  getTempToken(req: Req, res: Res, allow: boolean, expire: number, admin: boolean, cb: Function): void;

  tempToken(req: Req, res: Res): void;

  /**
   * Authenticate a user.
   *
   * @param req
   * @param forms {Mixed}
   *   A single form or an array of forms to authenticate against.
   * @param userField {String}
   *   The user submission field that contains the username.
   * @param passField {String}
   *   The user submission field that contains the password.
   * @param username {String}
   *   The user submission username to login with.
   * @param password {String}
   *   The user submission password to login with.
   * @param next {Function}
   *   The callback function to call after authentication.
   */
  authenticate(
    req: Req,
    forms: FormioForm | FormioForm[],
    userField: string,
    passField: string,
    username: string,
    password: string,
    next: Function
  ): void;

  /**
   * Interception logout request.
   * @param req
   * @param res
   * @param next
   */
  logout(req: Req, res: Res, next: Next): void;
}
