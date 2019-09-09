import {getConstructorArgNames, isClass, isString, nameOf} from "@tsed/core";
import {colorize} from "ts-log-debug/lib/layouts/utils/colorizeUtils";
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

  static throwInjectorError(token: any, currentDependency: any, error: any) {
    if (currentDependency && isClass(token)) {
      error.message = printDependencyInjectionError(token, {...currentDependency, message: error.message});
    }

    throw new InjectionError(token, error);
  }
}

function printDependencyInjectionError(token: any, options: {token: any; index: number; deps: any[]; message: string}) {
  let erroredArg = "";

  const args = getConstructorArgNames(token)
    .map((arg, index) => {
      if (options.index === index) {
        erroredArg = arg;
        arg = colorize(arg, "red");
      }

      return `${arg}: ${nameOf(options.deps[index])}`;
    })
    .join(", ");

  const signature = nameOf(token) + "->constructor(" + args + ")";
  const indexOf = signature.indexOf(erroredArg) - 5;
  const drawline = (indexOf: number) => " ".repeat(indexOf) + colorize("^" + "‾".repeat(erroredArg.length - 1), "red");

  return "Unable to inject dependency. " + options.message + "\n\n" + signature + "\n" + (indexOf > -1 ? drawline(indexOf) : "");
}
