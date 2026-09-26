const BaseCommand = require("./base_command")
const Constants = require("../../common/constants")
const Protocol = require('../../common/util/protocol')

class Scene extends BaseCommand {
  getUsage() {
    return [
      "Create and manage scenes",
      "/scene create [scene_name] [entity_id] [duration]",
      "/scene play [scene_name]",
      "/scene [player] play [scene_name]",
      "ex: /scene create LoadingScreen 1234 5",
      "/scene kuroro play LoadingScreen",
    ]
  }

  allowOwnerOnly() {
    return true
  }

  perform(player, args) {
    let subcommand = args[0]
    if (subcommand === 'play') {
      let sceneName = args[1]
      if (!this.game.hasScene(sceneName)) {
        player.showChatError("no such scene")
        return
      }

      let keyValueArgs = args.slice(2)
      let keyValueMap = this.convertKeyValueArgsToObj(keyValueArgs)

      if (keyValueMap) {
        this.game.playScene(sceneName, keyValueMap)
      } else {
        this.game.playScene(sceneName)
      }
    } else if (subcommand === "create") {
      let sceneName = args[1]
      let entityId = this.game.getEntityByNameOrId(args[2])
      if (!entityId) {
        player.showChatError("no such entity")
        return
      }
      if (!this.game.hasScene(sceneName)) {
        let dataToSend = {}
        dataToSend.entityId = entityId
        dataToSend.duration = args[3] || 5
        this.game.createScene(sceneName,dataToSend)
        player.showChatSuccess("Scene created")
      }
    } else if (subcommand == "rename") {
      if (!this.game.hasScene(sceneName)) {
        player.showChatError("no such scene")
        return
      }
      player.showChatSuccess(sceneName+" renamed to "+args[2])
      this.game.hasScene(sceneName).rename(args[2])
    }

  }
}

module.exports = Scene

