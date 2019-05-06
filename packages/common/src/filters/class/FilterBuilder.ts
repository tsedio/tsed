import {Type} from "@tsed/core";
import {InjectorService} from "@tsed/di";
import {ConverterService} from "../../converters";
import {ParseExpressionError} from "../errors/ParseExpressionError";
import {RequiredParamError} from "../errors/RequiredParamError";
import {UnknowFilterError} from "../errors/UnknowFilterError";
import {IFilter, IFilterPreHandler, IFilterScope} from "../interfaces";
import {FilterPreHandlers} from "../registries/FilterRegistry";
import {ValidationService} from "../services/ValidationService";
import {ParamMetadata} from "./ParamMetadata";

export class FilterBuilder {
  constructor(private injector: InjectorService) {}

  /**
   *
   * @param {Function} filter
   * @param {Function} newFilter
   * @param args
   * @returns {(value: any) => any}
   */
  private static pipe(filter: Function, newFilter: Function, ...args: any[]): Function {
    return (value: any) => newFilter(filter(value), ...args);
  }

  /**
   *
   */
  public build(param: ParamMetadata): Function {
    let filter: any = this.initFilter(param);
    filter = this.appendRequiredFilter(filter, param);
    filter = this.appendValidationFilter(filter, param);
    filter = this.appendConverterFilter(filter, param);

    return filter;
  }

  /**
   *
   * @param {Type<IFilter>} target
   * @param args
   * @returns {any}
   */
  private invoke(target: Type<IFilter>, ...args: any[]): any {
    const instance = this.injector.get<IFilter>(target);

    if (!instance || !instance.transform) {
      throw new UnknowFilterError(target);
    }

    const [expression, request, response] = args;

    return instance.transform(expression, request, response);
  }

  /**
   *
   * @param {ParamMetadata} param
   * @returns {any}
   */
  private initFilter(param: ParamMetadata): IFilterPreHandler {
    if (typeof param.service === "symbol") {
      const sym = param.service as symbol;

      if (FilterPreHandlers.has(sym)) {
        return FilterPreHandlers.get(sym)!;
      }
    }

    // wrap Custom Filter to FilterPreHandler
    return (locals: IFilterScope) => {
      return this.invoke(param.service as Type<any>, param.expression, locals.request, locals.response);
    };
  }

  /**
   *
   * @param filter
   * @param {ParamMetadata} param
   * @returns {(value: any) => any}
   */
  private appendRequiredFilter(filter: any, param: ParamMetadata): Function {
    if (!param.required) {
      return filter;
    }

    return FilterBuilder.pipe(
      filter,
      (value: any) => {
        if (param.isRequired(value)) {
          throw new RequiredParamError(param.name, param.expression);
        }

        return value;
      }
    );
  }

  /**
   *
   * @param filter
   * @param param
   * @returns {(value: any) => any}
   */
  private appendConverterFilter(filter: any, param: ParamMetadata): Function {
    if (!param.useConverter) {
      return filter;
    }

    const converterService = this.injector.get<ConverterService>(ConverterService)!;

    return FilterBuilder.pipe(
      filter,
      converterService.deserialize.bind(converterService),
      param.collectionType || param.type,
      param.type
    );
  }

  /**
   *
   * @param filter
   * @param param
   * @returns {(value: any) => any}
   */
  private appendValidationFilter(filter: any, param: ParamMetadata): Function {
    const type = param.type || param.collectionType;
    const {collectionType} = param;

    if (!param.useValidation || (param.useValidation && !type)) {
      return filter;
    }

    const validationService = this.injector.get<ValidationService>(ValidationService)!;

    return FilterBuilder.pipe(
      filter,
      (value: any) => {
        try {
          validationService.validate(value, type, collectionType);
        } catch (err) {
          throw new ParseExpressionError(param.name, param.expression, err);
        }

        return value;
      }
    );
  }
}
