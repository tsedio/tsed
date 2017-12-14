import {ConverterService} from "../../converters/services/ConverterService";
import {Type} from "../../core/interfaces";
import {InjectorService} from "../../di/services/InjectorService";
import {RequiredParamError} from "../errors/RequiredParamError";
import {IFilterPreHandler} from "../interfaces/IFilterPreHandler";
import {IFilterScope} from "../interfaces/IFilterScope";
import {FilterPreHandlers} from "../registries/FilterRegistry";
import {FilterService} from "../services/FilterService";
import {ValidationService} from "../services/ValidationService";
import {ParamMetadata} from "./ParamMetadata";

export class FilterBuilder {
    constructor() {

    }

    /**
     *
     */
    public build(param: ParamMetadata): Function {
        let filter: any = this.initFilter(param);
        filter = FilterBuilder.appendRequiredFilter(filter, param);
        filter = FilterBuilder.appendConverterFilter(filter, param);
        filter = FilterBuilder.appendValidationFilter(filter, param);
        return filter;
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
        const filterService = InjectorService.get<FilterService>(FilterService);
        const filter: IFilterPreHandler = (locals: IFilterScope) => {
            return filterService.invokeMethod(
                param.service as Type<any>,
                param.expression,
                locals.request,
                locals.response
            );
        };

        filter.param = param;

        return filter;
    }

    /**
     *
     * @param filter
     * @param {ParamMetadata} param
     * @returns {(value: any) => any}
     */
    private static appendRequiredFilter(filter: any, param: ParamMetadata): Function {
        if (!param.required) {
            return filter;
        }

        return FilterBuilder.pipe(
            filter,
            (value: any) => {
                if (!param.isValidRequiredValue(value)) {
                    throw new RequiredParamError(param.name, param.expression);
                }
                return value;
            });
    }

    /**
     *
     * @param filter
     * @param param
     * @returns {(value: any) => any}
     */
    private static appendConverterFilter(filter: any, param: ParamMetadata): Function {
        if (!param.useConverter) {
            return filter;
        }

        const type = param.type || param.collectionType;
        const {collectionType} = param;
        const converterService = InjectorService.get<ConverterService>(ConverterService);

        return FilterBuilder.pipe(
            filter,
            converterService.deserialize.bind(converterService),
            type,
            collectionType
        );
    }

    /**
     *
     * @param filter
     * @param param
     * @returns {(value: any) => any}
     */
    private static appendValidationFilter(filter: any, param: ParamMetadata): Function {
        const type = param.type || param.collectionType;
        const {collectionType} = param;

        if (!param.useValidation || param.useValidation && !type) {
            return filter;
        }

        const validationService = InjectorService.get<ValidationService>(ValidationService);
        return FilterBuilder.pipe(filter, validationService.validate.bind(validationService), type, collectionType);
    }

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
}