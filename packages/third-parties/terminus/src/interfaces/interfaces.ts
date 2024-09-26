import type {TerminusSettings} from "./TerminusSettings.js";

declare global {
  namespace TsED {
    interface Configuration {
      terminus: TerminusSettings;
    }
  }
}
