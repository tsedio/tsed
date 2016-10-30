
export interface IInvokableFunction extends Function {
    $inject?: (Function|string)[];
    $required?: number[];
    $metadata?: string[];
}
