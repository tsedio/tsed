import {getValue, nameOf, Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {of, Subject} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {ConverterService} from "../../converters";
import {ParseExpressionError} from "../errors/ParseExpressionError";
import {RequiredParamError} from "../errors/RequiredParamError";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter} from "../interfaces";
import {IHandlerContext, IParamContext} from "../interfaces/IHandlerContext";
import {ParamMetadata} from "../models/ParamMetadata";
import {ParamTypes} from "../models/ParamTypes";
import {ValidationService} from "../services/ValidationService";

export class ParamBuilder {
  constructor(private param: ParamMetadata) {}

  /**
   *
   * @param param
   * @param injector
   * @returns {(value: any) => any}
   */
  static getConverterPipe(param: ParamMetadata, injector: InjectorService) {
    if (!param.useConverter) {
      return;
    }
    const converterService = injector.get<ConverterService>(ConverterService)!;

    return (value: any) => {
      return converterService.deserialize(value, param.collectionType || param.type, param.type);
    };
  }

  /**
   *
   * @param param
   * @param injector
   * @returns {(value: any) => any}
   */
  static getValidationPipe(param: ParamMetadata, injector: InjectorService) {
    const {collectionType} = param;
    const type = param.type || param.collectionType;

    if (!param.useValidation || (param.useValidation && !type)) {
      return;
    }

    const validationService = injector.get<ValidationService>(ValidationService)!;

    return (value: any) => {
      try {
        validationService.validate(value, type, collectionType);
      } catch (err) {
        throw new ParseExpressionError(nameOf(param.service), param.expression, err);
      }

      return value;
    };
  }

  static getParseExpressionPipe(param: ParamMetadata) {
    const {service} = param;
    let {expression} = param;

    if (typeof service !== "string" || !expression) {
      return;
    }

    if (service === ParamTypes.HEADER) {
      expression = (param.expression || "").toLowerCase();
    }

    return (value: any) => getValue(expression, value);
  }

  /**
   *
   * @param {ParamMetadata} param
   * @returns {(value: any) => any}
   */
  static getRequiredPipe(param: ParamMetadata) {
    if (!param.required) {
      return;
    }

    return (value: any) => {
      if (param.isRequired(value)) {
        throw new RequiredParamError(nameOf(param.service), param.expression);
      }

      return value;
    };
  }

  static getInitialPipe(param: ParamMetadata, injector: InjectorService): (context: IParamContext) => any {
    const requestPipe: (context: IParamContext) => any = context => context.request;
    const contextPipe: (context: IParamContext) => any = context => requestPipe(context).ctx;

    switch (param.service) {
      case ParamTypes.BODY:
        return context => requestPipe(context).body;

      case ParamTypes.QUERY:
        return context => requestPipe(context).query;

      case ParamTypes.PATH:
        return context => requestPipe(context).params;

      case ParamTypes.HEADER:
        return context => requestPipe(context).headers;

      case ParamTypes.COOKIES:
        return context => requestPipe(context).cookies;

      case ParamTypes.SESSION:
        return context => requestPipe(context).session;

      case ParamTypes.LOCALS:
        return context => requestPipe(context).locals;

      case ParamTypes.RESPONSE:
        return context => context.response;

      case ParamTypes.REQUEST:
        return requestPipe;

      case ParamTypes.NEXT_FN:
        return context => context.next;

      case ParamTypes.ERR:
        return context => context.err;

      case ParamTypes.CONTEXT:
        return contextPipe;

      case ParamTypes.ENDPOINT_INFO:
        return context => contextPipe(context).endpoint;

      case ParamTypes.RESPONSE_DATA:
        return context => contextPipe(context).data;

      default:
        return this.getInvokableFilter(param, injector);
    }
  }

  static getInvokableFilter(param: ParamMetadata, injector: InjectorService): any {
    const target = param.service as Type<any>;
    const {expression} = param;

    return (context: IParamContext) => {
      const instance = injector.get<IFilter>(target);

      if (!instance || !instance.transform) {
        throw new UnknowFilterError(target);
      }

      return instance.transform(expression, context.request, context.response);
    };
  }

  private static getOperatorsPipe(param: ParamMetadata, injector: InjectorService) {
    const operators = [
      this.getInitialPipe(param, injector),
      this.getParseExpressionPipe(param),
      this.getRequiredPipe(param),
      this.getValidationPipe(param, injector),
      this.getConverterPipe(param, injector)
    ]
      .filter(Boolean)
      .map(o => map(o!));

    return (value: any) =>
      of(value)
        // @ts-ignore
        .pipe(...operators)
        .pipe(catchError(e => of(e)));
  }

  private static getContextPipe(param: ParamMetadata) {
    return (context: IHandlerContext) => ({
      ...context,
      param,
      expression: param.expression
    });
  }

  public build(injector: InjectorService) {
    const {param} = this;
    const subject = new Subject<IHandlerContext>();
    const observable = subject.pipe(
      map(ParamBuilder.getContextPipe(param)),
      switchMap(ParamBuilder.getOperatorsPipe(param, injector))
    );

    return {subject, observable};
  }
}
