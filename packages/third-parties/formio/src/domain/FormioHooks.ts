import {MongooseDocument} from "@tsed/mongoose";
import {Request, Response} from "express";
import {FilterQuery, Schema, SchemaDefinition} from "mongoose";

import {Formio} from "./Formio.js";
import {FormioActions} from "./FormioActionsIndex.js";
import {FormioConfig} from "./FormioConfig.js";
import {FormioDecodedToken} from "./FormioDecodedToken.js";
import {FormioJs} from "./FormioJs.js";
import {FormioActionItem, FormioForm, FormioModelsModels, FormioSubmission} from "./FormioModels.js";
import {FormioSettings} from "./FormioSettings.js";
import {ResourceRestOptions} from "./Resource.js";

export type FormioInitEvent = "alias" | "params" | "token" | "getTempToken" | "logout" | "current" | "access" | "perms";

export interface FormioHooks {
  settings?: (settings: FormioSettings, req: Request, cb: Function) => FormioSettings;
  alter?: {
    alias?: (alias: string, req: Request, res: Response) => string;
    /**
     * Alter FormioJs configuration
     * @param formIo
     */
    configFormio?: (formIo: {Formio: FormioJs}) => void;
    /**
     * Alter formio server configuration.
     * @param config
     */
    updateConfig?: (config: FormioConfig) => FormioConfig;
    /**
     * Alter audit log.
     * @param info
     * @param event
     * @param req
     */
    audit?: (info: any[], event: string, req: Request) => void;
    /**
     * Alter log.
     * @param info
     * @param event
     * @param req
     */
    log?: (event: string, req: Request, ...info: string[]) => void;
    /**
     * Alter available actions
     * @param info
     * @param event
     * @param req
     */
    actions?: (actions: FormioActions) => FormioActions;
    /**
     * Skip auth for the current request.
     * @param info
     * @param event
     * @param req
     */
    skip?: (value: boolean, req: Request) => boolean;
    /**
     * Resolve host.
     * @param baseUrl
     * @param req
     */
    host?: (baseUrl: string, req: Request) => string;
    /**
     * `/form/${req.params.formId}/action`
     * @param action
     * @param req
     */
    path?: (path: string, req: Request) => any;
    /**
     * Restrict request types
     * @param methods
     */
    methods?: (methods: string[]) => string[];
    /**
     * Return the cors configuration.
     */
    cors?: () => Record<string, any>;
    /**
     * Return the current user submission.
     */
    currentUser?: (user: any) => any;
    /**
     * Alter current form.
     * @param form
     */
    currentForm?: (form: FormioForm) => FormioForm;
    /**
     * Alter formio
     * @param formio
     */
    formio?: (formio: Formio) => Formio;
    /**
     * Alter models
     * @param models
     */
    models?: (models: FormioModelsModels) => FormioModelsModels;
    /**
     * Alter resources
     * @param resources
     */
    resources?: (resources: {form: any; submission: any; role: any}) => any;

    resourceAccessFilter?: (search: any, req: Request, done: (err: unknown, newSearch: any) => void) => void;

    // machineName
    actionMachineName?: (name: string, document: MongooseDocument<any>, done: Function) => void;
    formMachineName?: (name: string, document: MongooseDocument<any>, done: Function) => void;
    roleMachineName?: (name: string, document: MongooseDocument<any>, done: Function) => void;

    // schemas
    actionSchema?: (schema: Schema) => Schema;
    actionItemSchema?: (schema: Schema) => Schema;
    formSchema?: (schema: Schema) => Schema;
    roleSchema?: (schema: Schema) => Schema;
    schemaSchema?: (schema: Schema) => Schema;
    submissionSchema?: (schema: Schema | SchemaDefinition) => Schema;
    tokenSchema?: (schema: Schema) => Schema;
    permissionSchema?: (schema: SchemaDefinition) => SchemaDefinition;
    fieldMatchAccessPermissionSchema?: (schemaOptions: SchemaDefinition) => SchemaDefinition;

    // query
    actionsQuery?: <DocType = any>(query: FilterQuery<DocType>, req: Request) => FilterQuery<DocType>;
    submissionQuery?: <DocType = any>(query: FilterQuery<DocType>, req: Request) => FilterQuery<DocType>;
    roleQuery?: <DocType = any>(query: FilterQuery<DocType>, req: Request) => FilterQuery<DocType>;
    formQuery?: <DocType = any>(query: FilterQuery<DocType>, req: Request) => FilterQuery<DocType>;

    // Data
    actionItem?: (actionItem: FormioActionItem, req: Request) => FormioActionItem;
    actionContext?: (actionContext: any, req: Request) => any;
    actionInfo?: (action: any, req: Request) => any;

    // submission
    submission?: (req: Request, res: Response, done: Function) => void;
    submissionRequest?: (submission: FormioSubmission) => FormioSubmission;
    validateSubmissionForm?: (form: FormioForm, submission: FormioSubmission, done: Function) => void;
    postSubmissionUpdate?: (req: Request, res: Response, submissionUpdate: FormioSubmission) => void;

    // response
    /**
     * Allow modules to hook into the form loader middleware.
     * @param item
     * @param req
     * @param done
     */
    formResponse?: (item: any, req: Request, done: Function) => void;

    // params
    requestParams?: (req: Request & {formId: string; subId: string; roleId: string}, params: Record<string, any>) => void;
    /**
     * Alter submitted params
     * @param params
     */
    submissionParams?: (params: string[]) => string[];

    // Routes
    /**
     * Alter actions routes.
     */
    actionRoutes?: (options: ResourceRestOptions) => ResourceRestOptions;
    /**
     * Alter roles routes.
     */
    rolesRoutes?: (options: ResourceRestOptions) => ResourceRestOptions;
    /**
     * Alter forms routes.
     */
    formRoutes?: (options: ResourceRestOptions) => ResourceRestOptions;
    /**
     * Alter submission routes.
     */
    submissionRoutes?: (options: ResourceRestOptions) => ResourceRestOptions;

    // Auth
    user?: (user: any, done: (err: any, user: any) => void) => void;
    login?: (user: any, req: Request, done: (err: any) => void) => void;
    token?: (token: FormioDecodedToken, form: FormioForm, req: Request) => FormioDecodedToken;
    tokenDecode?: (token: FormioDecodedToken, req: Request, done: (err: any, decoded: FormioDecodedToken) => void) => void;
    submissionRequestTokenQuery?: (query: {formId: string; submissionId: string}, token: string) => any;

    [key: string]: any;
  };
  on?: {
    init?: (type: FormioInitEvent) => boolean;
    [key: string]: any;
  };
}

export interface FormioHook {
  /**
   * Run settings function.
   */
  settings(req: Request, cb: Function): void;

  /**
   * Emit an event.
   * @param args
   */
  invoke<T = any>(...args: any[]): T | boolean;

  /**
   * Alter the given value by calling all listener.
   * @param event
   * @param args
   */
  alter(event: string, ...args: any[]): any;
}
