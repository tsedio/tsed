import {getJobSchedulerId} from "./getJobSchedulerId.js";

describe("getJobSchedulerId", () => {
  it("should build the id from the cron pattern", () => {
    expect(getJobSchedulerId("job", {pattern: "* * * * *"})).toEqual("job:* * * * *");
  });
  it("should build the id from the interval", () => {
    expect(getJobSchedulerId("job", {every: 1000})).toEqual("job:1000");
  });
  it("should include the timezone and the end date", () => {
    expect(getJobSchedulerId("job", {pattern: "* * * * *", tz: "Europe/Paris", endDate: new Date(1000)})).toEqual(
      "job:* * * * *:Europe/Paris:1000"
    );
  });
});
