import {Request, Response} from "express";

import {FormioErrors} from "./FormioErrors.js";
import {FormioJs} from "./FormioJs.js";

export interface FormioUtil {
  Formio: FormioJs;
  /**
   * Iterate through each component within a form.
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Function} fn
   *   The iteration function to invoke for each component.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   * @param {String} path
   */
  eachComponent: Function;
  /**
   * Get a component by its key
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {String} key
   *   The key of the component to get.
   *
   * @returns {Object}
   *   The component that matches the given key, or undefined if not found.
   */
  getComponent: Function;
  /**
   * Define if component should be considered input component
   *
   * @param {Object} componentJson
   *   JSON of component to check
   *
   * @returns {Boolean}
   *   If component is input or not
   */
  isInputComponent: Function;
  /**
   * Flatten the form components for data manipulation.
   *
   * @param {Object} components
   *   The components to iterate.
   * @param {Boolean} includeAll
   *   Whether or not to include layout components.
   *
   * @returns {Object}
   *   The flattened components map.
   */
  flattenComponents: Function;
  /**
   * Get the value for a component key, in the given submission.
   *
   * @param {Object} submission
   *   A submission object to search.
   * @param {String} key
   *   A for components API key to search for.
   */
  getValue: Function;
  /**
   * Determine if a component is a layout component or not.
   *
   * @param {Object} component
   *   The component to check.
   *
   * @returns {Boolean}
   *   Whether or not the component is a layout component.
   */
  isLayoutComponent: Function;
  /**
   * Apply JSON logic functionality.
   *
   * @param component
   * @param row
   * @param data
   */
  jsonLogic: Function;
  /**
   * Check if the condition for a component is true or not.
   *
   * @param component
   * @param row
   * @param data
   */
  checkCondition: Function;
  flattenComponentsForRender: Function;
  renderFormSubmission: Function;
  renderComponentValue: Function;
  /**
   * A node-fetch shim adding support for http(s) proxy and allowing
   * invalid tls certificates (to be used with self signed certificates).
   *
   * @param {any} url The request url string or url like object.
   * @param {any} options The request options object.
   * @returns {Promise<Response>} The promise with the node-fetch response object.
   */
  fetch: any;

  base64: {
    /**
     * Base64 encode the given data.
     *
     * @param {String} decoded
     *   The decoded data to encode.
     *
     * @return {String}
     *   The base64 representation of the given data.
     */
    encode(decoded: string): string;
    /**
     * Base64 decode the given data.
     *
     * @param {String} encoded
     *   The encoded data to decode.
     *
     * @return {String}
     *   The ascii representation of the given encoded data.
     */
    decode(encoded: string): string;
  };
  /**
   * Application error codes.
   */
  errorCodes: FormioErrors;

  layoutComponents: ("panel" | "table" | "well" | "columns" | "fieldset" | "tabs" | string)[];

  deleteProp(target: any, propertyKey: any): any;

  /**
   * A wrapper around console.log that gets ignored by eslint.
   *
   * @param {*} content
   *   The content to pass to console.log.
   */
  log(content: string): void;

  /**
   * Determine if a value is a boolean representation.
   * @param value
   * @return {boolean}
   */
  isBoolean(value: any): boolean;

  /**
   * Quick boolean coercer.
   * @param value
   * @return {boolean}
   */
  boolean(value: any): boolean;

  /**
   * A wrapper around console.error that gets ignored by eslint.
   *
   * @param {*} content
   *   The content to pass to console.error.
   */
  error(content: any): void;

  /**
   * Returns the URL alias for a form provided the url.
   */
  getAlias(req: Request, reservedForms: string[]): {alias: string; additional: string};

  /**
   * Escape a string for use in regex.
   *
   * @param str
   * @returns {*}
   */
  escapeRegExp(str: string): string;

  /**
   * Create a sub response object that only handles errors.
   *
   * @param res
   * @return {{send: function(), sendStatus: function(*=), status: function(*=)}}
   */
  createSubResponse(res: Response): Response;

  /**
   * Create a sub-request object from the original request.
   *
   * @param req
   */
  createSubRequest(req: Request): Request;

  /**
   * Return the objectId.
   *
   * @param id
   * @returns {*}
   * @constructor
   */
  ObjectId(id: string): any;

  /**
   * Search the request headers for the given key.
   *
   * @param req
   *   The Express request object.
   * @param key
   *   The key to search for in the headers.
   *
   * @return
   *   The header value if found or false.
   */
  getHeader(req: Request, key: string): string | false;

  /**
   * Search the request query for the given key.
   *
   * @param req
   *   The Express request object.
   * @param key
   *   The key to search for in the query.
   *
   * @return
   *   The query value if found or false.
   */
  getQuery(req: Request, key: string): any | false;

  /**
   * Search the request parameters for the given key.
   *
   * @param req
   *   The Express request object.
   * @param key
   *   The key to search for in the parameters.
   *
   * @return
   *   The parameter value if found or false.
   */
  getParameter(req: Request, key: string): any | false;

  /**
   * Determine if the request has the given key set as a header or url parameter.
   *
   * @param req
   *   The Express request object.
   * @param key
   *   The key to search for.
   *
   * @return
   *   Return the value of the key or false if not found.
   */
  getRequestValue(req: Request, key: string): any | false;

  /**
   * Split the given URL into its key/value pairs.
   *
   * @param url
   *   The request url to split, typically req.url.
   *
   * @returns {{}}
   *   The key/value pairs of the request url.
   */
  getUrlParams(url: string): Record<string, any>;

  /**
   * Converts a form component key into a submission key
   * by putting .data. between each nested component
   * (ex: `user.name` becomes `user.data.name` in a submission)
   * @param key
   *   The key to convert
   * @return
   *   The submission key
   */
  getSubmissionKey(key: string): string;

  /**
   * Converts a submission key into a form component key
   * by replacing .data. with .
   * (ex: `user.data.name` becomes `user.name` in a submission)
   * @param key
   *   The key to convert
   * @return
   *   The form component key
   */
  getFormComponentKey(key: string): string;

  /**
   * Utility function to ensure the given id is always a BSON object.
   *
   * @param _id {String|Object}
   *   A mongo id as a string or object.
   *
   * @returns {Object}
   *   The mongo BSON id.
   */
  idToBson(_id: string | any): any;

  /**
   * Utility function to ensure the given id is always a string object.
   *
   * @param _id {String|Object}
   *   A mongo id as a string or object.
   *
   * @returns {String}
   *   The mongo string id.
   */
  idToString(_id: string | any): string;

  /**
   * Ensures that a submission data has MongoDB ObjectID's for all "id" fields.
   * @param data
   * @return {boolean}
   */
  ensureIds(data: any[]): any;

  removeProtectedFields(form: string, action: string, submissions: any): void;

  /**
   * Retrieve a unique machine name
   *
   * @param document
   * @param model
   * @param next
   * @return {*}
   */
  uniqueMachineName(document: {machineName: string}, model: any, next: (err?: Error) => void): void;

  castValue<T = any>(valueType: "string" | "number" | "boolean" | "[number]" | "[string]", value: any): T;

  valuePath(prefix: string, key: string): string;

  eachValue(components: any, data: any, fn: Function, context: any, path?: string): void;
}
