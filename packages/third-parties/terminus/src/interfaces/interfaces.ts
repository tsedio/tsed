import {TerminusSettings} from "./TerminusSettings";

declare global {
  namespace TsED {
    interface Configuration {
      terminus: TerminusSettings;
    }
  }
}
