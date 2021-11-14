import {getConstructorArgNames, isClass, isString, nameOf} from "@tsed/core";
import {TokenProvider} from "../interfaces";

type ColorTextFn = (text: string) => string;

// istanbul ignore next
const colorIfAllowed = (colorFn: ColorTextFn) => (text: string) => (!process.env.NO_COLOR ? colorFn(text) : text);

const red = colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`);

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
          this.stack = origin.stack;
        }
      }
    }

    const originMessage = this.origin ? "\nOrigin: " + this.origin.message : "";
    const tokensMessage = this.tokens.map((token) => nameOf(token)).join(" > ");

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
        arg = red(arg);
      }

      return `${arg}: ${nameOf(options.deps[index])}`;
    })
    .join(", ");

  const signature = nameOf(token) + "->constructor(" + args + ")";
  const indexOf = signature.indexOf(erroredArg) - 5;
  const drawline = (indexOf: number) => " ".repeat(indexOf) + red("^" + "‾".repeat(erroredArg.length - 1));

  return "Unable to inject dependency. " + options.message + "\n\n" + signature + "\n" + (indexOf > -1 ? drawline(indexOf) : "");
}
