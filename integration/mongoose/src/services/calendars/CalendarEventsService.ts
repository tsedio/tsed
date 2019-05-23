import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug/lib";
import {CalendarEvent} from "../../models/events/CalendarEvent";

@Service()
export class CalendarEventsService {
  @Inject(CalendarEvent)
  private Event: MongooseModel<CalendarEvent>;

  private static checkPrecondition(event: CalendarEvent) {
    if (event.dateStart.getTime() > event.dateEnd.getTime()) {
      new BadRequest("dateStart to be under dateEnd.");
    }
  }

  $onInit() {
    this.reload();
  }

  async reload() {
    const events = await this.Event.find({});

    if (events.length === 0) {
      this.Event.create(...require("../../../resources/events.json"));
    }
  }

  /**
   * Find a CalendarEvent by his ID.
   * @param id
   * @returns {undefined|EventModel}
   */
  async find(id: string): Promise<CalendarEvent> {
    return await this.Event.findById(id).exec();
  }

  async save(event: CalendarEvent) {
    CalendarEventsService.checkPrecondition(event);
    $log.debug({message: "Validate event", event});
    const eventModel = new this.Event(event);

    await eventModel.validate();
    $log.debug({message: "Save event", eventModel});
    await eventModel.update(event, {upsert: true});

    $log.debug({message: "Event saved", event});

    return eventModel;
  }

  /**
   * Return all CalendarEvent for a calendarID.
   * @returns {CalendarEvent[]}
   */
  async query(calendarId: string): Promise<CalendarEvent[]> {
    const events = await this.Event
      .find({calendarId: calendarId})
      .exec();

    return events;
  }

  async remove(id: string): Promise<void> {
    return await this.Event.findById(id).remove().exec();
  }
}
