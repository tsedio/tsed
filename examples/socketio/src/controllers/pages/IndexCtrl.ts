import {Controller, Get, View} from "@tsed/common";
import {Name} from "@tsed/schema";
import {SquareGameService} from "../../services/SquareGameService";

@Controller("/")
@Name("Pages")
export class IndexCtrl {
  constructor(private squareGameService: SquareGameService) {
  }

  @Get("/")
  @View("index.ejs")
  async getIndex() {
    return {
      appName: "SquareGame",
      MAX_PLAYERS: this.squareGameService.maxPlayers,
      SCORE_MAX: this.squareGameService.scoreMax
    };
  }
}
