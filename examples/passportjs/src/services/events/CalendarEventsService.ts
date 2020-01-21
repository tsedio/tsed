import {Service} from "@tsed/common";
import {Event} from "../../models/Event";
import {MemoryCollection} from "../../utils/MemoryCollection";

@Service()
export class CalendarEventsService extends MemoryCollection<Event> {
  constructor() {
    super(Event);

    require("../../../resources/events.json")
      .map((obj) => {
        return this.create(obj);
      });
  }

  /**
   * Find a calendar by his ID.
   * @param id
   * @returns {undefined|Calendar}
   */
  async findById(id: string): Promise<Event> {
    return this.findById(id);
  }
}
