import {init} from "../src/index.js";
import path from "path";

init(path.join(import.meta.dirname, "../../.."))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
