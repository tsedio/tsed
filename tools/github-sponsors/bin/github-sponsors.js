#!/usr/bin/env node
import path from "path";

import {init} from "../src/index.js";

init(path.join(import.meta.dirname, "../../.."))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
