import {BadRequest, Exception, InternalServerError, NotFound} from "@tsed/exceptions";
import * as Express from "express";
import {getCalendar} from "../services/CalendarService";

const app = Express();

app.get("/calendars/:id", async (req: any, res: any, next: any) => {
  const {
    params: {id}
  } = req;

  if (isNaN(+id)) {
    const error = new BadRequest("ID is not a number");

    // Additionally
    error.setHeaders({
      "x-header": "value"
    });

    error.errors = [{message: "ID is not a number"}];
    error.body = "Not a number";

    return next(error);
  }

  try {
    const calendar = await getCalendar(res.params.id);

    if (!calendar) {
      return next(new NotFound("Calendar not found"));
    }

    res.json(calendar);
  } catch (origin) {
    next(new InternalServerError("Oops! Something is wrong", origin));
  }
});

// GlobalHandler middleware catch exception and send response to the client
app.use((err: any, request: any, response: any, next: any) => {
  if (err instanceof Exception) {
    if (err.errors) {
      // If errors is provided
      response.set({"x-errors": JSON.stringify(err.errors)});
    }

    if (err.headers) {
      response.set(err.headers);
    }

    if (err.body) {
      // If a body is provided
      return response.status(err.status).json(err.body);
    }

    return response.status(err.status).send(err.message);
  }

  next();
});
