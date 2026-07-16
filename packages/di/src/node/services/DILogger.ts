import {Logger} from "@tsed/logger";
import {injectable} from "../../common/fn/injectable.js";
import {logger} from "../../common/fn/logger.js";

injectable(Logger).factory(logger);
