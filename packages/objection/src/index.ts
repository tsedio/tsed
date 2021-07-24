import {Config} from "knex";
import "./utils/patchModelJson";

declare global {
  namespace TsED {
    interface Configuration {
      knex: Config;
    }
  }
}

// components
export * from "./components/createStringColumn";
export * from "./components/createIdColumn";
export * from "./components/createBooleanColumn";
export * from "./components/createNumberColumn";

// decorators
export * from "./decorators/entity";
export * from "./decorators/decimal";
export * from "./decorators/idColumn";
export * from "./decorators/columnOptions";

// services
export * from "./services/ObjectionConnection";

// utils
export * from "./utils/connect";
export * from "./utils/createColumns";
export * from "./utils/getColumnCtx";
