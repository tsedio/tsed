import {isString, nameOf} from "@tsed/core";
import {TokenProvider} from "../interfaces";

export class InjectionError extends Error {
  name = "INJECTION_ERROR";

  public tokens: TokenProvider[] = [];
  public origin: any;

  constructor(token: TokenProvider, origin?: any) {
    super(isString(origin) ? origin : "");

    this.tokens = [token];

    if (origin) {
      if (isString(origin)) {
        this.origin = {
          message: origin,
          stack: this.stack
        };
      } else {
        if (origin.tokens) {
          this.tokens = this.tokens.concat(origin.tokens);
          this.origin = origin.origin;
        } else {
          this.origin = origin;
        }
      }
    }

    const originMessage = this.origin ? "\nOrigin: " + this.origin.message : "";
    const tokensMessage = this.tokens.map(token => nameOf(token)).join(" > ");

    this.message = `Injection failed on ${tokensMessage}${originMessage}`;
  }
}
