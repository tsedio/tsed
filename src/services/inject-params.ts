import {INJECT_PARAMS} from "../constants/metadata-keys";
import Metadata from "./metadata";
import {getClassName} from "../utils/class";

export default class InjectParams {
    /**
     *
     */
    public required: boolean;
    /**
     *
     */
    public expression: string | RegExp;
    /**
     *
     */
    public use: any;
    /**
     *
     * @type {boolean}
     */
    public useConverter: boolean = true;
    /**
     *
     */
    public baseType: any;
    /**
     *
     */
    private _service: string | symbol;
    /**
     *
     */
    private _name: string;

    /**
     *
     * @returns {symbol}
     */
    get service(): symbol {

        return <any>this._service;
    }

    /**
     *
     * @param value
     */
    set service(value: symbol) {

        this._service = value;
        this._name = this._service.toString().replace("Symbol(", "").replace(")", "");
    }

    /**
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    get useName(): string {
        return this.use ? getClassName(this.use) : undefined;
    }

    get baseTypeName(): string {
        return this.baseType && this.useName !== getClassName(this.baseType) ? getClassName(this.baseType) : undefined;
    }

    /**
     *
     * @returns {{service: (string|symbol), name: string, expression: string, required: boolean, use: undefined, baseType: undefined}}
     */
    toJSON() {
        return {
            service: this._service,
            name: this._name,
            expression: this.expression,
            required: this.required,
            use: this.useName,
            baseType: this.baseTypeName
        };
    }

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @returns {any}
     */
    static get(target: any, targetKey: string | symbol, index: number): InjectParams {

        const params = this.getParams(target, targetKey);

        params[index] = params[index] || new InjectParams();

        return params[index];

    }

    static getParams(target: any, targetKey: string | symbol): InjectParams[] {

        return Metadata.has(INJECT_PARAMS, target, targetKey)
            ? Metadata.get(INJECT_PARAMS, target, targetKey)
            : [];
    }

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @param injectParams
     */
    static set(target: any, targetKey: string | symbol, index: number, injectParams: InjectParams): void {

        const params = Metadata.has(INJECT_PARAMS, target, targetKey)
            ? Metadata.get(INJECT_PARAMS, target, targetKey)
            : [];

        params[index] = injectParams;

        Metadata.set(INJECT_PARAMS, params, target, targetKey);
    }

    /**
     *
     * @param service
     * @param options
     */
    static build(service: symbol, options) {

        let {
            propertyKey,
            parameterIndex,
            expression,
            target,
            useClass,
            useConverter
        } = options;

        const injectParams = InjectParams.get(target, propertyKey, parameterIndex);
        const baseType = Metadata.getParamTypes(target, propertyKey)[parameterIndex];

        if (typeof expression !== "string") {
            useClass = <any>expression;
            expression = undefined;
        }

        injectParams.service = service;
        injectParams.expression = expression;
        injectParams.baseType = baseType;
        injectParams.use = useClass || baseType;

        if (useConverter !== undefined) {
            injectParams.useConverter = useConverter;
        }

        InjectParams.set(target, propertyKey, parameterIndex, injectParams);
    }
}