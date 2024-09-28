import {Enum} from "@tsed/schema";

import {DataSourceJson, getFormioSchema, Select} from "../src/index.js";

enum TestEnum {
  VALUE1 = "VALUE1",
  VALUE2 = "VALUE2"
}

describe("Enum", () => {
  it("should generate the correct schema with enum", async () => {
    class Test {
      @Enum(TestEnum)
      test: TestEnum;
    }

    const form = await getFormioSchema(Test);

    expect(form).toMatchSnapshot();
  });

  it("should generate the correct schema with select", async () => {
    class Test {
      @Enum(TestEnum)
      @Select()
      test: TestEnum;
    }

    const form = await getFormioSchema(Test);

    expect(form).toMatchSnapshot();
  });

  it("should generate the correct schema with select custom value", async () => {
    class Test {
      @Enum(TestEnum)
      @Select()
      @DataSourceJson(Object.values(TestEnum).map((value) => ({label: `label ${value}`, value})))
      test: TestEnum;
    }

    const form = await getFormioSchema(Test);

    expect(form).toMatchSnapshot();
  });
});
