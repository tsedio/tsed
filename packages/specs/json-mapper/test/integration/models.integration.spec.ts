import {Property, Required} from "@tsed/schema";

import {serialize} from "../../src/utils/serialize.js";

export class Menu {
  @Property()
  id: string;

  @Required()
  label: string;

  @Property()
  subMenus: SubMenu[];
}

export class SubMenu {
  @Property()
  id: string;

  @Required()
  label: string;

  @Required()
  menu: Menu;

  @Property() // badly decorated
  subItems: SubItem[];
}

export class SubItem {
  @Property()
  id: string;

  @Required()
  label: string;

  @Required()
  subMenu: SubMenu;
}

describe("Menu", () => {
  it("should serialize object correctly", () => {
    const subItems = new SubItem();
    subItems.id = "id";
    subItems.label = "label";

    const submenu = new SubMenu();
    submenu.id = "id";
    submenu.label = "label";
    submenu.subItems = [subItems];

    const menu = new Menu();
    menu.id = "id";
    menu.label = "label";
    menu.subMenus = [submenu];

    expect(serialize(menu, {type: Menu})).toEqual({
      id: "id",
      label: "label",
      subMenus: [
        {
          id: "id",
          label: "label",
          subItems: [
            {
              id: "id",
              label: "label"
            }
          ]
        }
      ]
    });
  });
});
