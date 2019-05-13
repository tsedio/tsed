import {Controller, Get, RouteService, ServerLoader, ServerSettings} from "@tsed/common";

@Controller("/events")
export class EventCtrl {
  @Get()
  get() {
  }
}

@Controller({
  path: "/calendars",
  children: [EventCtrl]
})
export class CalendarCtrl {
  @Get()
  get() {
  }
}

@Controller({
  path: "/rest",
  children: [
    CalendarCtrl,
    EventCtrl
  ]
})
export class RestCtrl {
  constructor(private routeService: RouteService) {
  }

  @Get()
  get() {
    return this.routeService.printRoutes();
  }
}

@ServerSettings({
  mount: {
    "/": [
      RestCtrl
    ]
  }
})
class Server extends ServerLoader {
}
