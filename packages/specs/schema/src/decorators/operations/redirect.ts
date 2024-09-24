import {isNumber, isString, useDecorators} from "@tsed/core";

import {JsonHeader} from "../../interfaces/JsonOpenSpec.js";
import {JsonEntityFn} from "../common/jsonEntityFn.js";
import {Returns} from "./returns.js";

/**
 * Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”.
 *
 * ```typescript
 *  @Redirect('/foo/bar')
 *  @Redirect(301, 'http://example.com').Type(Model)
 *  private myMethod() {}
 * ```
 * Redirects can be a fully-qualified URL for redirecting to a different site:
 *
 * ```typescript
 *  @Redirect('http://google.com');
 *  private myMethod() {}
 * ```
 *
 * Redirects can be relative to the root of the host name. For example, if the application is on http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:
 *
 * ```typescript
 *  @Redirect('/admin');
 * ```
 * Redirects can be relative to the current URL. For example, from http://example.com/blog/admin/ (notice the trailing slash), the following would redirect to the URL http://example.com/blog/admin/post/new.
 *
 * ```typescript
 *  @Redirect('post/new');
 * ```
 *
 * Redirecting to post/new from http://example.com/blog/admin (no trailing slash), will redirect to http://example.com/blog/post/new.
 *
 * If you found the above behavior confusing, think of path segments as directories (with trailing slashes) and files, it will start to make sense.
 *
 * Path-relative redirects are also possible. If you were on http://example.com/admin/post/new, the following would redirect to http//example.com/admin/post:
 *
 * ```typescript
 *  @Redirect('..');
 * ``
 *
 * A back redirection redirects the request back to the referer, defaulting to / when the referer is missing.
 *
 * ```typescript
 *  @Redirect('back');
 * ```
 *
 * @param url
 * @param meta
 * @decorator
 * @operation
 * @response
 * @headers
 */
export function Redirect(url: string, meta?: JsonHeader): Function;
export function Redirect(status: number, url: string, meta?: JsonHeader): Function;
export function Redirect(...args: any[]): Function {
  const {status, url, meta} = args.reduce(
    (options: any, value: any) => {
      if (isNumber(value)) {
        options.status = value;
        return options;
      }

      if (isString(value)) {
        options.url = value;
        return options;
      }

      options.meta = value;
      return options;
    },
    {status: 302, url: "", meta: {}}
  );
  return useDecorators(
    Returns(status).Location(url, meta),
    JsonEntityFn((entity) => {
      entity.operation?.setRedirection(status);
    })
  );
}
