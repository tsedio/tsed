import {LocalsContainer} from "../domain/LocalsContainer.js";
import type {UseImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import {InjectorService} from "../services/InjectorService.js";
import {injector} from "./injector.js";

let globalLocals: LocalsContainer | undefined;
let globalInvOpts: any = {};
const stagedLocals: LocalsContainer[] = [];

/**
 * Get or create the current locals container for request-scoped providers.
 *
 * Returns the global locals container used for storing request-scoped provider instances.
 * Can optionally create a new container with custom providers.
 *
 * ### Usage
 *
 * ```typescript
 * import {localsContainer} from "@tsed/di";
 *
 * // Get current locals
 * const locals = localsContainer();
 *
 * // Create with custom providers
 * const locals = localsContainer({
 *   providers: [{token: MyService, use: mockInstance}],
 *   rebuild: true
 * });
 * ```
 *
 * @param options Configuration options
 * @param options.providers Optional array of provider overrides
 * @param options.rebuild Whether to mark providers for rebuilding
 * @returns The locals container instance
 * @public
 */
export function localsContainer({
  providers,
  rebuild
}: {
  providers?: UseImportTokenProviderOpts[];
  rebuild?: boolean;
} = {}) {
  if (!globalLocals || providers) {
    globalLocals = new LocalsContainer();

    if (providers) {
      providers.forEach((p) => {
        globalLocals!.set(p.token, p.use);
      });

      globalLocals.set(InjectorService, injector());
    }

    if (rebuild) {
      globalInvOpts.rebuild = rebuild;
    }
  }

  return globalLocals;
}

export function invokeOptions() {
  return {...globalInvOpts};
}

/**
 * Detach and stage the current locals container.
 *
 * Removes the global locals reference and saves it for cleanup.
 * Used internally to manage request scope lifecycle.
 *
 * @public
 */
export function detachLocalsContainer() {
  globalLocals && stagedLocals.push(globalLocals);
  globalLocals = undefined;
  globalInvOpts = {};
}

export function cleanAllLocalsContainer() {
  detachLocalsContainer();
  stagedLocals.map((item) => item.clear());
}
