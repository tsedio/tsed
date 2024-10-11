import {Logger} from "@tsed/logger";

import {injectable} from "../../common/fn/injectable.js";
import {logger} from "../fn/logger.js";

injectable(Logger).factory(logger);
