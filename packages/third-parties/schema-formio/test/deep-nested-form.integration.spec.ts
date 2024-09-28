import {Default, Property} from "@tsed/schema";

import {Form, getFormioSchema, Label} from "../src/index.js";

@Form({label: "One hour before this maintenance"})
export class AutomationOneHourBefore {
  @Label("Remind subscribers")
  @Default(true)
  deliverNotifications: boolean = true;
}

@Form({label: "At the start time for this maintenance"})
export class AutomationAtStartTime {
  @Label("Set status to 'In Progress'")
  @Default(true)
  updateStatus: boolean = true;

  @Label("Set affected components' status to 'Under Maintenance'")
  @Default(true)
  setComponentStatus: boolean = true;

  @Label("Notify subscribers")
  @Default(true)
  deliverNotifications: boolean = true;
}

@Label("At the end of time for this maintenance")
export class AutomationAtEndTime {
  @Label("Set status to 'Completed'")
  @Default(true)
  updateStatus: boolean = true;

  @Label("Set affected components' status to 'Under Maintenance'")
  @Default(true)
  setComponentStatus: boolean = true;

  @Label("Notify subscribers")
  @Default(true)
  deliverNotifications: boolean = true;
}

@Label("Automation options test")
export class AutomationOptions {
  @Property()
  oneHourBefore: AutomationOneHourBefore;

  @Property()
  atStartTime: AutomationAtStartTime;

  @Property()
  atEndTime: AutomationAtEndTime;
}

@Form({
  included: {
    components: `/components`
  }
})
export class ScheduledMaintenance {
  @Property()
  automationOptions: AutomationOptions;
}

describe("Deep Nested form integration", () => {
  it("should generate form and nested form", async () => {
    const form = await getFormioSchema(ScheduledMaintenance);

    expect(form).toMatchSnapshot();
  });
});
