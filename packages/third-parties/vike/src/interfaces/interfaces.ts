import {VikeConfig} from "./VikeConfig";

declare global {
  namespace TsED {
    interface Configuration {
      vike: VikeConfig;
    }
  }
}
