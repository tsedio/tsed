import {UseAfter} from "./use-after";
import ResponseViewMiddleware from "../../middlewares/response-view";
import {Endpoint} from "../../controllers/endpoint";

/**
 * Renders a view and sends the rendered HTML string to the client. Optional parameter:
 *
 * * viewOptions, an object whose properties define local variables for the view.
 *
 * The view argument is a string that is the file path of the view file to render.
 * This can be an absolute path, or a path relative to the views setting.
 * If the path does not contain a file extension, then the view engine setting determines the file extension.
 * If the path does contain a file extension, then Express will load the module for the specified template engine (via require())
 * and render it using the loaded module’s __express function.
 *
 * For more information, see [Using template engines with Express](http://expressjs.com/guide/using-template-engines.html).
 *
 * > NOTE: The view argument performs file system operations like reading a file from disk and evaluating Node.js modules,
 * and as so for security reasons should not contain input from the end-user.
 *
 * @param viewPath
 * @param viewOptions
 * @returns {Function}
 * @constructor
 */
export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(ResponseViewMiddleware, {viewPath, viewOptions}, target, targetKey);

        return UseAfter(ResponseViewMiddleware)(target, targetKey, descriptor);
    };
}

/**
 * Renders a view and sends the rendered HTML string to the client. Optional parameter:
 *
 * * viewOptions, an object whose properties define local variables for the view.
 *
 * The view argument is a string that is the file path of the view file to render.
 * This can be an absolute path, or a path relative to the views setting.
 * If the path does not contain a file extension, then the view engine setting determines the file extension.
 * If the path does contain a file extension, then Express will load the module for the specified template engine (via require())
 * and render it using the loaded module’s __express function.
 *
 * For more information, see [Using template engines with Express](http://expressjs.com/guide/using-template-engines.html).
 *
 * > NOTE: The view argument performs file system operations like reading a file from disk and evaluating Node.js modules,
 * and as so for security reasons should not contain input from the end-user.
 *
 * @param viewPath
 * @param viewOptions
 * @returns {Function}
 * @constructor
 */
export function Render(viewPath: string, viewOptions?: Object): Function {
    return ResponseView(viewPath, viewOptions);
}