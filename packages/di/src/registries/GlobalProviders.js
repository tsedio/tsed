"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const Provider_1 = require("../class/Provider");
class GlobalProviderRegistry extends core_1.Registry {
    constructor() {
        super(Provider_1.Provider);
        /**
         * Internal Map
         * @type {Array}
         */
        this._registries = new Map();
    }
    /**
     *
     * @param {string} type
     * @param {Type<Provider<any>>} model
     * @param options
     * @returns {Registry<Provider<any>, IProvider<any>>}
     */
    createRegistry(type, model, options = { injectable: true }) {
        const registry = new core_1.Registry(model, {
            onCreate: this.set.bind(this)
        });
        this._registries.set(type, Object.assign({
            registry,
            injectable: true
        }, options));
        return registry;
    }
    /**
     *
     * @param {string | TokenProvider} target
     * @returns {RegistrySettings | undefined}
     */
    getRegistrySettings(target) {
        let type = "provider";
        if (typeof target === "string") {
            type = target;
        }
        else {
            const provider = this.get(target);
            if (provider) {
                type = provider.type;
            }
        }
        if (this._registries.has(type)) {
            return this._registries.get(type);
        }
        return {
            registry: this,
            injectable: true
        };
    }
    /**
     *
     * @returns {(provider: (any | IProvider<any>), instance?: any) => void}
     */
    createRegisterFn(type) {
        return (provider, instance) => {
            if (!provider.provide) {
                provider = {
                    provide: provider
                };
            }
            provider = Object.assign({ instance }, provider, { type });
            this.getRegistry(type).merge(provider.provide, provider);
        };
    }
    /**
     *
     * @param {string | TokenProvider} target
     * @returns {Registry<Provider<any>, IProvider<any>>}
     */
    getRegistry(target) {
        return this.getRegistrySettings(target).registry;
    }
}
exports.GlobalProviderRegistry = GlobalProviderRegistry;
/**
 *
 * @type {GlobalProviders}
 */
// tslint:disable-next-line: variable-name
exports.GlobalProviders = new GlobalProviderRegistry();
//# sourceMappingURL=GlobalProviders.js.map