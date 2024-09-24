import {toMap as tMap} from "@tsed/core";
import {MongooseDocument} from "@tsed/mongoose";

import {FormioMapper} from "./FormioMapper.js";

function toMap<T>(list: any[]) {
  return tMap<string, MongooseDocument<T>>(list, (o: any) => [o._id.toString(), `$machineName:${o.machineName}`]);
}

describe("FormioMapper", () => {
  it("should map data to import (obj)", () => {
    const mapper = new FormioMapper({
      forms: toMap([{_id: "form_id", machineName: "form_machine"}]),
      actions: toMap([{_id: "action_id", machineName: "action_machine"}]),
      roles: toMap([{_id: "role_id", machineName: "role_machine"}])
    });
    const data = {
      form: "form_machine",
      value: 0,
      notAnId: "id",
      date: new Date()
    };

    const result = mapper.mapToImport(data);

    expect(result).toEqual({
      ...data,
      form: "form_id"
    });
  });
  it("should map data to import (array)", () => {
    const mapper = new FormioMapper({
      forms: toMap([{_id: "form_id", machineName: "form_machine"}]),
      actions: toMap([{_id: "action_id", machineName: "action_machine"}]),
      roles: toMap([{_id: "role_id", machineName: "role_machine"}])
    });
    const data = {
      form: "form_machine",
      value: 0,
      notAnId: "id",
      date: new Date()
    };
    const result = mapper.mapToImport([data]);

    expect(result).toEqual([
      {
        ...data,
        form: "form_id"
      }
    ]);
  });
  it("should map data to export (obj)", () => {
    const mapper = new FormioMapper({
      forms: toMap([{_id: "form_id", machineName: "form_machine"}]),
      actions: toMap([{_id: "action_id", machineName: "action_machine"}]),
      roles: toMap([{_id: "role_id", machineName: "role_machine"}])
    });
    const data = {
      form: "form_id",
      value: 0,
      notAnId: "id",
      date: new Date()
    };

    const result = mapper.mapToExport(data);

    expect(result).toEqual({
      ...data,
      form: "$machineName:form_machine"
    });
  });
  it("should map data to export (array)", () => {
    const mapper = new FormioMapper({
      forms: toMap([{_id: "form_id", machineName: "form_machine"}]),
      actions: toMap([{_id: "action_id", machineName: "action_machine"}]),
      roles: toMap([{_id: "role_id", machineName: "role_machine"}])
    });
    const data = {
      form: "form_id",
      value: 0,
      notAnId: "id",
      date: new Date()
    };
    const result = mapper.mapToExport([data]);

    expect(result).toEqual([
      {
        ...data,
        form: "$machineName:form_machine"
      }
    ]);
  });
});
