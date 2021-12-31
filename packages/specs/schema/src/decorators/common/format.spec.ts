import {getJsonSchema} from "../../utils/getJsonSchema";
import {DateFormat, DateTime, Email, Format, TimeFormat, Uri, Url} from "./format";

describe("@Format", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Format("email")
      email: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        email: {
          format: "email",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@Email", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Email()
      email: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        email: {
          format: "email",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@DateFormat", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @DateFormat()
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          format: "date",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@TimeFormat", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @TimeFormat()
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          format: "time",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@DateTime", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @DateTime()
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          format: "date-time",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@Uri", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Uri()
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          format: "uri",
          type: "string"
        }
      },
      type: "object"
    });
  });
});

describe("@Url", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Url()
      prop: string;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        prop: {
          format: "url",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
