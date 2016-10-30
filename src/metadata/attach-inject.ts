
import Metadata from './metadata';
import {INJECT_SERV, INJECT_META} from '../constants/metadata-keys';

/**
 * Create metadata to set a list of service. This service will be injected when the method is invoked with the invoke method.
 * @param target
 * @param targetKey
 * @param index
 * @param service
 * @param metadata
 */
export function attachInject(target: any, targetKey: string | symbol, index: number, service: string | Function, metadata?: string): void {

    const services = Metadata.has(INJECT_SERV, target, targetKey) ? Metadata.get(INJECT_SERV, target, targetKey) : [];
    const metas = Metadata.has(INJECT_META, target, targetKey) ? Metadata.get(INJECT_SERV, target, targetKey) : [];

    services[index] = service;
    metas[index] = metadata;

    Metadata.set(INJECT_SERV, services, target, targetKey);
    Metadata.set(INJECT_META, metas, target, targetKey);

}