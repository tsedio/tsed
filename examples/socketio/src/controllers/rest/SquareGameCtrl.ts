import {BodyParams, Controller, Get, Patch} from "@tsed/common";
import {SquareGameSettings} from "../../models/SquareGameSettings";
import {SquareGameService} from "../../services/SquareGameService";

@Controller("/squaregame")
export class SquareGameCtrl {
  constructor(private squareGameService: SquareGameService) {
  }

  @Get("/settings")
  getSettings(): SquareGameSettings {
    const {maxPlayers, scoreMax} = this.squareGameService;

    return {
      maxPlayers,
      scoreMax
    };
  }

  @Patch("/settings")
  patchSettings(@BodyParams("maxPlayers") maxPlayers: number, @BodyParams("scoreMax") scoreMax: number): SquareGameSettings {
    if (maxPlayers && maxPlayers >= 2) {
      this.squareGameService.maxPlayers = maxPlayers;
    }

    if (scoreMax && scoreMax >= 5) {
      this.squareGameService.scoreMax = scoreMax;
    }

    return this.getSettings();
  }
}
