import {Service} from "@tsed/common";
import {Calendar} from "../../models/Calendar";
import {MemoryCollection} from "../../utils/MemoryCollection";

@Service()
export class CalendarsService extends MemoryCollection<Calendar> {
  constructor() {
    super(Calendar, require("../../../resources/calendars.json"));
  }

  /**
   * Find a calendar by his ID.
   * @param id
   * @returns {undefined|Calendar}
   */
  findById(id: string) {
    return this.findOne({_id: id});
  }
}
