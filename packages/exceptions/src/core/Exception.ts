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
  public origin: Error;
  /**
   * HTTP Code Status
   */
  public status: number;
  /**
   *
   */
  public body: any;

  [key: string]: any;

  constructor(status: number = 500, message: string = "", origin?: Error | string | any) {
    super(message);

    this.status = status;
    this.message = message;

    this.setOrigin(origin);
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
    return (this.name + "(" + this.status + "): " + this.message + " ").trim();
  }
}

export class HTTPException extends Exception {}
