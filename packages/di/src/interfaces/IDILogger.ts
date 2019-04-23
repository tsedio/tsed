export interface IDILogger {
  info(...args: any[]): void | any;

  warn(...args: any[]): void | any;

  debug(...args: any[]): void | any;

  error(...args: any[]): void | any;

  trace(...args: any[]): void | any;

  [key: string]: any;
}
