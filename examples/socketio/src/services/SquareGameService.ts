import {Args, Broadcast, Input, Nsp, Socket, SocketService, SocketSession, SocketUseBefore} from "@tsed/socketio";
import {Namespace} from "socket.io";
import {$log} from "@tsed/logger";
import {SocketMiddlewareLogger} from "../middlewares/SocketMiddlewareLogger";
import {PlayerSG} from "../models/PlayerSG";

@SocketService("/square-game")
@SocketUseBefore(SocketMiddlewareLogger)
export class SquareGameService {

  private AUTO_INCREMENT = 0;
  /**
   *
   * @type {Map<string, SocketIO.Socket>}
   */
  private players: Map<string, PlayerSG> = new Map<string, PlayerSG>();
  private currentSquare: any;
  /**
   *
   */
  private tick;
  @Nsp
  private nsp: Namespace;

  /**
   * Nb player max
   */
  private _maxPlayers: number = 2;

  /***
   *
   * @type {number}
   */
  private _scoreMax: number = 10;

  get maxPlayers(): number {
    return this._maxPlayers;
  }

  set maxPlayers(value: number) {
    this._maxPlayers = value;
    this.initGame();
    this.updatePlayersReady();
  }

  get scoreMax(): number {
    return this._scoreMax;
  }

  set scoreMax(value: number) {
    this._scoreMax = value;
    this.initGame();
    this.updatePlayersReady();
  }

  public initGame() {
    this.stopGame();
    this.nsp.emit("server.init.game", {
      "maxPlayers": this.maxPlayers,
      "scoreMax": this.scoreMax
    }, this.getPlayers());
  }

  /**
   *
   * @param { SocketIO.Socket} socket
   * @param session
   */
  $onConnection(@Socket socket: Socket, @SocketSession session: SocketSession) {
    $log.debug("New connection, ID =>", socket.id);
    session.set("player", new PlayerSG(socket.id));
  }

  /**
   *
   * @param { SocketIO.Socket} socket
   */
  $onDisconnect(@Socket socket: SocketIO.Socket) {
    if (this.players.has(socket.id)) {
      const player = this.players.get(socket.id);

      $log.debug("Player disconnected =>", player.name, player.id);

      this.players.delete(player.id);
      this.stopGame();

      this.nsp.emit("server.stop.game", player, this.getPlayers());
    }
  }

  /**
   * Ajoute une joueur à la liste des joueurs.
   * Emet l'événement 'newplayer' si le joueur vient d'être créé.
   * @param name
   * @param session
   */
  @Input("client.player.name")
  @Broadcast("server.player.new")
  public setPlayerName(@Args(0) name: string, @SocketSession session: SocketSession): PlayerSG[] {
    const player = session.get("player");

    $log.debug("New player =>", name);

    player.name = name;

    if (this.players.size === this._maxPlayers) {
      $log.debug("stack overflow :p");

      return;
    }

    this.players.set(player.id, player);

    return this.getPlayers();
  }

  @Input("client.start.game")
  public startGame(): void {

    try {
      if (!this.tick) {

        $log.debug("Start game");

        this.sendSquarePosition();
        this.tick = setInterval(() => this.sendSquarePosition(), 1000);
      }
    } catch (er) {
      console.error(er);
    }
  }

  @Input("client.player.ready")
  @Broadcast("server.update.players.ready")
  public setPlayerReady(@SocketSession session: SocketSession) {
    const player = session.get("player");

    $log.debug(player.name + " is ready");

    player.isReady = true;

    return this.updatePlayersReady();
  }

  @Input("client.delete.square")
  public deleteSquare(@Args(0) id: number, @Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    const player = session.get("player");
    $log.debug("Player has clicked on the square =>", player.name);

    if (+id === this.currentSquare.id) {
      player.scoreUp();
      this.nsp.emit("server.deleted.square", this.getPlayers(), player);
    }

    if (player.score >= this._scoreMax) {

      this.stopGame();

      socket.broadcast.emit("server.player.loose", player);
      socket.emit("server.player.win", player);
    }
  }

  /**
   *
   */
  public updatePlayersReady() {
    $log.debug("Waiting players", this.getNbPlayersReady(), "===", this._maxPlayers);

    if (+this.getNbPlayersReady() === +this._maxPlayers) {
      $log.debug("All players are ready");
      this.nsp.emit("server.start.countdown");
    }

    return this.getPlayers();
  }

  /**
   *
   * @returns {number}
   */
  public getNbPlayersReady() {
    let counter = 0;

    this
      .players
      .forEach(player => {
        if (player.isReady) {
          counter++;
        }
      });


    return counter;
  }

  /**
   * Retourne la liste des joueurs.
   * @returns {Array}
   */
  public getPlayers(): PlayerSG[] {
    const players = [];
    this.players.forEach(e => players.push(e));

    return players;
  }

  /**
   *
   */
  public stopGame() {
    clearInterval(this.tick);
    delete this.tick;
  }

  /**
   *
   */
  private sendSquarePosition() {
    const index = Math.floor(Math.random() * 12),
      bgc = "#" + ((1 << 24) * Math.random() | 0).toString(16);

    this.currentSquare = {index, bgc, id: this.AUTO_INCREMENT++};

    this.nsp.emit("server.update.square", this.currentSquare);
  }
}
