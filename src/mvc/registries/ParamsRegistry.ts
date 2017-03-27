import {ParamMetadata} from "../class/ParamMetadata";
import {Type} from "../../core/interfaces/Type";
import {Metadata} from "../../core/class/Metadata";
import {EXPRESS_NEXT_FN, PARAM_METADATA} from "../constants/index";
import {IParamArgs} from "../interfaces/Arguments";
import {IInjectableParamSettings} from "../interfaces/InjectableParamsMetadata";

export class ParamsRegistry {
    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @returns {any}
     */
    static get(target: Type<any>, targetKey: string | symbol, index: number): ParamMetadata {

        const params = this.getParams(target, targetKey);

        params[index] = params[index] || new ParamMetadata();

        return params[index];

    }

    /**
     *
     * @param target
     * @param targetKey
     * @returns {Array}
     */
    static getParams = (target: Type<any>, targetKey: string | symbol): ParamMetadata[] =>
        Metadata.has(PARAM_METADATA, target, targetKey)
            ? Metadata.get(PARAM_METADATA, target, targetKey)
            : [];

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @param injectParams
     */
    static set(target: Type<any>, targetKey: string | symbol, index: number, injectParams: ParamMetadata): void {

        const params = Metadata.has(PARAM_METADATA, target, targetKey)
            ? Metadata.get(PARAM_METADATA, target, targetKey)
            : [];

        params[index] = injectParams;

        Metadata.set(PARAM_METADATA, params, target, targetKey);
    }

    /**
     *
     * @param target
     * @param method
     */
    static isInjectable = (target, method): boolean =>
    (Metadata.get(PARAM_METADATA, target, method) || []).length > 0;

    /**
     *
     * @param service
     * @param settings
     */
    static useService(service: symbol, settings: IParamArgs<any>) {
        const param = ParamsRegistry.get(settings.target, settings.propertyKey, settings.parameterIndex);
        param.service = service;
        param.useConverter = false;

        ParamsRegistry.set(settings.target, settings.propertyKey, settings.parameterIndex, param);
        return this;
    }

    /**
     *
     * @param target
     * @param propertyKey
     * @param parameterIndex
     */
    static required(target: Type<any>, propertyKey: string | symbol, parameterIndex: number) {
        const param = ParamsRegistry.get(target, propertyKey, parameterIndex);

        param.required = true;

        ParamsRegistry.set(target, propertyKey, parameterIndex, param);
        return this;
    }

    /**
     *
     * @param service
     * @param options
     */
    static useFilter(service: Type<any>, options: IInjectableParamSettings<any>): ParamMetadata {
        let {
            propertyKey,
            parameterIndex,
            expression,
            target,
            useType,
            useConverter
        } = options;

        const param = ParamsRegistry.get(target, propertyKey, parameterIndex);
        const baseType = Metadata.getParamTypes(target, propertyKey)[parameterIndex];

        if (typeof expression !== "string") {
            useType = <any>expression;
            expression = undefined;
        }

        param.service = service;
        param.expression = expression;
        param.baseType = baseType;
        param.useType = useType || baseType;

        if (useConverter !== undefined) {
            param.useConverter = useConverter;
        }

        ParamsRegistry.set(target, propertyKey, parameterIndex, param);

        return param;
    }

    /**
     *
     * @param target
     * @param propertyKey
     */
    static hasNextFunction = (target: Type<any>, propertyKey: string) =>
    ParamsRegistry
        .getParams(target, propertyKey)
        .findIndex((p) => p.service === EXPRESS_NEXT_FN) > -1;
}