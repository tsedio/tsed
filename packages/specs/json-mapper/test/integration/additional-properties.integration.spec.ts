import {useDecorators} from "@tsed/core";
import {AdditionalProperties, Groups, Hidden, JsonEntityStore, Name, ReadOnly, Title} from "@tsed/schema";
import {sentenceCase, snakeCase} from "change-case";

import {deserialize, serialize} from "../../src/index.js";

describe("AdditionalProperties", () => {
  describe("deserialize then serialize", () => {
    function Snake() {
      return (target: any, propertyKey: string) => Name(snakeCase(propertyKey))(target, propertyKey);
    }

    function Label(label?: string) {
      return (target: any, propertyKey: string) => {
        const type = JsonEntityStore.from(target, propertyKey).computedType;

        label = (label ? label : sentenceCase(propertyKey)) + (type === Boolean ? "" : ":");

        return useDecorators(Snake(), Title(label))(target, propertyKey);
      };
    }

    class OIDCBase {
      @Label()
      @ReadOnly()
      @Hidden()
      created?: Date;

      @Label()
      @ReadOnly()
      @Hidden()
      modified?: Date;
    }

    @AdditionalProperties(true)
    class OIDCUser extends OIDCBase {
      @Label()
      @Groups("partners")
      salesmanId: string;
    }

    it("should deserialize and the serialize object without losing groups properties + additional properties", () => {
      const user = deserialize(
        {
          salesmanId: "00239496"
        },
        {type: OIDCUser, useAlias: true}
      );

      expect(user.salesmanId).toEqual("00239496");

      expect(serialize(user, {type: OIDCUser})).toEqual({
        salesman_id: "00239496"
      });
    });
  });
});
