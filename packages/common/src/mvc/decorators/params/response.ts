import {ParamTypes} from "../../models/ParamTypes";
import {UseParam} from "./useParam";

/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Response(): ParameterDecorator;
export function Response(): ParameterDecorator {
  return Res();
}

/**
 * Request service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export function Res(): ParameterDecorator;
export function Res(): ParameterDecorator {
  return UseParam(ParamTypes.RESPONSE);
}
declare global {
  namespace TsED {
    export interface Response {
      headersSent: boolean;
      writableEnded: boolean;
      writableFinished: boolean;
      statusCode: number;

      /**
       * Set header `field` to `val`, or pass
       * an object of header fields.
       *
       * Examples:
       *
       *    res.set('Foo', ['bar', 'baz']);
       *    res.set('Accept', 'application/json');
       *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
       *
       * Aliased as `res.header()`.
       */
      set(key: string, value: any): any;

      set(headers: {[key: string]: any}): any;

      /**
       * Set status `code`.
       */
      status(code: number): any;

      pipe(pipe: any): any;

      send(body?: any): any;

      /**
       * Send JSON response.
       *
       * Examples:
       *
       *     res.json(null);
       *     res.json({ user: 'tj' });
       *     res.status(500).json('oh noes!');
       *     res.status(404).json('I dont have that');
       */
      json(obj: any): any;

      /**
       * Set _Content-Type_ response header with `type` through `mime.lookup()`
       * when it does not contain "/", or set the Content-Type to `type` otherwise.
       *
       * Examples:
       *
       *     res.type('.html');
       *     res.type('html');
       *     res.type('json');
       *     res.type('application/json');
       *     res.type('png');
       */
      contentType(type: string): this;

      /**
       * Set the location header to `url`.
       *
       * The given `url` can also be the name of a mapped url, for
       * example by default express supports "back" which redirects
       * to the _Referrer_ or _Referer_ headers or "/".
       *
       * Examples:
       *
       *    res.location('/foo/bar').;
       *    res.location('http://example.com');
       *    res.location('../login'); // /blog/post/1 -> /blog/login
       *
       * Mounting:
       *
       *   When an application is mounted and `res.location()`
       *   is given a path that does _not_ lead with "/" it becomes
       *   relative to the mount-point. For example if the application
       *   is mounted at "/blog", the following would become "/blog/login".
       *
       *      res.location('login');
       *
       *   While the leading slash would result in a location of "/login":
       *
       *      res.location('/login');
       */
      location(url: string): this;

      /**
       * Redirect to the given `url` with optional response `status`
       * defaulting to 302.
       *
       * The resulting `url` is determined by `res.location()`, so
       * it will play nicely with mounted apps, relative paths,
       * `"back"` etc.
       *
       * Examples:
       *
       *    res.redirect('/foo/bar');
       *    res.redirect('http://example.com');
       *    res.redirect(301, 'http://example.com');
       *    res.redirect('http://example.com', 301);
       *    res.redirect('../login'); // /blog/post/1 -> /blog/login
       */
      redirect(url: string): void;

      redirect(status: number, url: string): void;

      redirect(url: string, status: number): void;
    }
  }
}
/**
 * Response service.
 *
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Response extends TsED.Response {
}
/**
 * Response service.
 *
 * @alias Response
 * @decorator
 * @operation
 * @input
 * @response
 */
export interface Res extends TsED.Response {
}
