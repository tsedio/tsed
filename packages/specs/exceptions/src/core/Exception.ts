import {constantCase} from "change-case";
import statuses from "statuses";

function getStatusConstant(status: number) {
  return status === 200 ? "SUCCESS" : constantCase(String(statuses(status)));
}

export class Exception extends Error {
  /**
   * Exception base name
   * @type {string}
   */
  public name: string = "HTTP_EXCEPTION";
  /**
   * Message of the exception
   */
  public message: string;
  /**
   * Exception type
   * @type {string}
   */
  public type: string = "HTTP_EXCEPTION";
  /**
   * Stack calling
   */
  public stack: string;
  public origin: Error & any;
  /**
   * HTTP Code Status
   */
  public status: number;
  /**
   *
   */
  public body: any;
  /**
   * Headers must be sent to the response
   */
  public headers: {[key: string]: any} = {};

  [key: string]: any;

  constructor(status: number = 500, message: string = "", origin?: Error | string | any) {
    super(message);

    this.status = status;
    this.message = message;
    this.name = getStatusConstant(status);

    this.setOrigin(origin);
  }

  setHeaders(headers: {[key: string]: any}) {
    this.headers = {
      ...this.headers,
      ...headers
    };

    return this;
  }

  setHeader(key: string, value: any) {
    this.headers[key] = value;

    return this;
  }

  setOrigin(origin: Error | string | any) {
    if (origin) {
      if (origin instanceof Error) {
        this.origin = origin;
        this.message = `${this.message}, innerException: ${this.origin.message}`.trim();
      } else if (typeof origin === "string") {
        this.origin = new Error(origin);
        this.message = `${this.message}, innerException: ${this.origin.message}`.trim();
      } else {
        this.body = origin;
      }
    }
  }

  toString() {
    return `${this.name}(${this.status}): ${this.message} `.trim();
  }
}

export class HTTPException extends Exception {}
