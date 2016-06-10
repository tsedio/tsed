
declare interface IInvokedFunction extends Function {
    $inject?: (Function|string)[];
    $required?: number[];
    $metadata?: string[];
}
