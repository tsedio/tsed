/**
 *
 */
class SquareGameComponent {

  constructor($scope, $element, $timeout, squareGameService) {
    this.showForm = true;
    this.countdown = 3;
    this.showCountdown = false;
    this.players = [];
    this.squares = new Array(16);
    this.player = {};
    this.squareGameService = squareGameService;
    this.$timeout = $timeout;
    this.$element = $element;
    this.currentSquare = {};

    $scope.$on("connect", this.onConnect.bind(this));
    $scope.$on("init.game", this.onInitGame.bind(this));
    $scope.$on("player.new", this.onUpdatePlayers.bind(this));
    $scope.$on("update.players.ready", this.onUpdatePlayers.bind(this));
    $scope.$on("update.square", this.onUpdateSquare.bind(this));
    $scope.$on("deleted.square", this.onDeletedSquare.bind(this));
    $scope.$on("player.win", this.onPlayerWin.bind(this));
    $scope.$on("player.loose", this.onPlayerLoose.bind(this));
    $scope.$on("start.countdown", this.onStartCountdown.bind(this));
    $scope.$on("stop.game", this.onStopGame.bind(this));
    $scope.$on("disconnect", this.onDisconnect.bind(this));
  }

  /**
   *
   */
  $onInit() {

  }

  /**
   *
   */
  $postLink() {
    this.widthViewport = this.$element.find(".square-game-area").width() + "px";
    $(".settings-modal").modal();
  }

  onConnect() {
    this.hasSocketNetwork = true;
    this.squareGameService
      .getConfiguration()
      .then((settings, players) => {
        this.maxPlayers = settings.maxPlayers;
        this.scoreMax = settings.scoreMax;
        this.players = players;
      });
  }

  onInitGame($event, settings) {
    this.maxPlayers = settings.maxPlayers;
    this.scoreMax = settings.scoreMax;
    this.ready = false;
    this.currentSquare = {};
    this.player.isReady = false;

    Materialize.toast("Les conditions de jeu ont changé", 4000);
  }

  /**
   *
   * @param $event
   * @param players
   */
  onUpdatePlayers($event, players) {
    console.log("Players", players);
    this.players = players;
  }

  /**
   *
   * @param $event
   * @param square
   */
  onUpdateSquare($event, square) {
    this.currentSquare = square;
  }

  /**
   *
   * @param $event
   * @param users
   * @param user
   */
  onDeletedSquare($event, users, user) {
    this.currentSquare = {};
    this.players = users;

    Materialize.toast(`${user.name} marque 1 point`, 2000);
  }

  /**
   *
   */
  onStartCountdown($event) {
    console.log("Start countdown");

    this.showCountdown = true;
    this.countdown = 3;
    this.ready = true;

    this.tick();
  }

  /**
   *
   * @param $event
   * @param player
   * @param players
   */
  onStopGame($event, player, players) {
    this.ready = false;
    this.info = undefined;

    Materialize.toast(`${player.name} s'est déconnecté`, 3000);

    this.players = players;
    this.currentSquare = {};

    this.player.isReady = false;
  }

  /**
   *
   * @param $event
   */
  onPlayerWin($event, user) {
    this.win = true;
  }

  /**
   *
   * @param $event
   */
  onPlayerLoose($event, user) {
    this.loose = true;
    this.playerWinner = user;
  }

  /**
   *
   */
  tick() {
    console.log("Tick countdown");
    this.tickValue = this.$timeout(() => {

      if (!this.ready) {
        this.stopTick();
        return;
      }

      if (this.countdown > 0) {
        this.countdown--;
        this.tick();
      } else {
        this.showCountdown = false;
        this.squareGameService.startGame();
      }
    }, 1000);
  }

  /**
   *
   */
  stopTick() {
    this.$timeout.cancel(this.tickValue);
    this.countdown = 10;
    this.showCountdown = false;
  }

  /**
   *
   */
  submit() {
    this.squareGameService.setPlayerName(this.player.name);
    this.showForm = false;
  }

  /**
   *
   * @param index
   */
  onClickSquare(index) {
    if (this.currentSquare.index === index) {
      console.log("===> onClickSquare", this.currentSquare.index, index);
      this.squareGameService.squareClicked(this.currentSquare.id);
    }
  }

  /**
   *
   */
  onClickReady() {
    this.player.isReady = true;
    this.squareGameService.ready();
  }


  onDisconnect() {
    this.player.isReady = false;
    this.hasSocketNetwork = false;
    this.showForm = true;
    this.ready = false;
    this.players = [];
    this.currentSquare = {};
  }

  playersNotReady() {
    if (this.players.length < this.maxPlayers) {
      return true;
    }

    return !!this.players.find((p) => !p.isReady);
  }

  openSettings() {
    this.settings = {
      scoreMax: this.scoreMax,
      maxPlayers: this.maxPlayers
    };
    $(".settings-modal").modal("open");
  }

  submitSettings(settings) {
    this.squareGameService.setConfiguration(settings);
    $(".settings-modal").modal("close");
  }
}

angular
  .module("squareGame")
  .component("squareGame", {

    templateUrl: "/partials/square-game.html",

    bindings: {
      maxPlayers: "@",
      scoreMax: "@"
    },

    controller: ($scope, $element, $timeout, SquareGameService) =>
      new SquareGameComponent($scope, $element, $timeout, SquareGameService)

  });

