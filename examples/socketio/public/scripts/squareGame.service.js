const WS_EVENTS = [
  'player.new', 'update.players.ready',
  'player.win', 'player.loose',
  'update.square', 'deleted.square',
  'start.countdown', 'stop.game',
  'init.game'
]

class SquareGameService {

  constructor($rootScope, $http) {

    this.$http = $http

    console.log('WS try connection')

    this.socket = io(document.location.host + '/square-game')

    this.socket.on('connect', () => {
      console.log('WS connected, id =>', this.socket.io.engine.id)
      this.socketId = this.socket.io.engine.id
      $rootScope.$apply(() => $rootScope.$broadcast('connect'))
    })

    WS_EVENTS.forEach((eventName) => {
      console.log('Event binded =>', `server.${eventName}`)
      this.socket.on(`server.${eventName}`, (...args) => {
        console.log('Event=>', eventName, ...args)
        $rootScope.$apply(() => $rootScope.$broadcast(eventName, ...args))
      })
    })

    this.socket.on('disconnect', () => {
      $rootScope.hasSocketNetwork = false
      console.log('Event => Disconnect')
      $rootScope.$apply(() => $rootScope.$broadcast('disconnect'))
    })
  }

  /**
   *
   * @returns {*}
   */
  getSocketId() {
    return this.socketId
  }

  /**
   *
   * @param playerName
   */
  setPlayerName(playerName) {
    console.log('Set player name', playerName)
    this.socket.emit('client.player.name', playerName)
  }

  /**
   *
   */
  ready() {
    this.socket.emit('client.player.ready')
  }

  /**
   *
   */
  startGame() {
    this.socket.emit('client.start.game')
  }

  /**
   *
   */
  squareClicked(id) {
    this.socket.emit('client.delete.square', id)
  }

  getConfiguration() {
    return this.$http.get('rest/squaregame/settings').then(response => response.data)
  }

  setConfiguration(settings) {
    return this.$http.patch('rest/squaregame/settings', settings).then(response => response.data)
  }
}

angular
  .module('squareGame')
  .service('SquareGameService', function ($rootScope, $http) {
    return new SquareGameService($rootScope, $http)
  })
