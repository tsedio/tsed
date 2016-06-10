/**
 * Create metadata to set a list of service. This service will be injected when the method is invoked with the invoke method.
 * @param method
 * @param index
 * @param service
 * @param metadata
 */
export function attachInject(method: IInvokedFunction, index: number, service: string | Function, metadata?: string): void {
    method.$inject = method.$inject || [];
    method.$inject[index] = service;

    method.$metadata = method.$metadata || [];
    method.$metadata[index] = metadata;
}