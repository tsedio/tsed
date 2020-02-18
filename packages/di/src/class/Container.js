"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalProviders_1 = require("../registries/GlobalProviders");
const LocalsContainer_1 = require("./LocalsContainer");
const Provider_1 = require("./Provider");
class Container extends LocalsContainer_1.LocalsContainer {
    /**
     *
     * @param token
     * @param settings
     */
    add(token, settings = {}) {
        const provider = GlobalProviders_1.GlobalProviders.has(token) ? GlobalProviders_1.GlobalProviders.get(token).clone() : new Provider_1.Provider(token);
        Object.assign(provider, settings);
        return super.set(token, provider);
    }
    /**
     * Add a provider to the
     * @param token
     * @param settings
     */
    addProvider(token, settings = {}) {
        return this.add(token, settings);
    }
    /**
     *
     * @param token
     */
    hasProvider(token) {
        return super.has(token);
    }
    /**
     * Add a provider to the
     * @param token
     * @param provider
     */
    setProvider(token, provider) {
        return super.set(token, provider);
    }
    /**
     * The getProvider() method returns a specified element from a Map object.
     * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
     * @param token
     */
    getProvider(token) {
        return super.get(token);
    }
    /**
     * Get all providers registered in the injector container.
     *
     * @param {ProviderType} type Filter the list by the given ProviderType.
     * @returns {[RegistryKey , Provider<any>][]}
     */
    getProviders(type) {
        return Array.from(this)
            .filter(([key, provider]) => (type ? provider.type === type : true))
            .map(([key, provider]) => provider);
    }
    addProviders(container) {
        container.forEach(provider => {
            if (!this.hasProvider(provider.provide) && !provider.root) {
                this.setProvider(provider.provide, provider.clone());
            }
        });
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map