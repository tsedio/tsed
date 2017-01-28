
export interface IInjectableMethod {
    target?: any;
    methodName?: string;
    designParamTypes?: any[];
    locals?: Map<Function, any>;
}