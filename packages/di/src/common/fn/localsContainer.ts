import {LocalsContainer} from "../domain/LocalsContainer.js";
import type {UseImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import {InjectorService} from "../services/InjectorService.js";
import {injector} from "./injector.js";

let globalLocals: LocalsContainer | undefined;
const stagedLocals: LocalsContainer[] = [];

/**
 * Get the locals container initiated by DITest or .bootstrap() method.
 */
export function localsContainer({providers}: {providers?: UseImportTokenProviderOpts[]; rebuild?: boolean} = {}) {
  if (!globalLocals || providers) {
    globalLocals = new LocalsContainer();

    if (providers) {
      providers.forEach((p) => {
        globalLocals!.set(p.token, p.use);
      });

      globalLocals.set(InjectorService, injector());
    }
  }

  return globalLocals;
}

/**
 * Reset the locals container.
 */
export function detachLocalsContainer() {
  globalLocals && stagedLocals.push(globalLocals);
  globalLocals = undefined;
}

export function cleanAllLocalsContainer() {
  detachLocalsContainer();
  stagedLocals.map((item) => item.clear());
}
