const BaseCommand = require("./base_command")
const Constants = require("../../common/constants")
const Protocol = require('../../common/util/protocol')

class Scene extends BaseCommand {
  getUsage() {
    return [
      "Create and manage scenes",
      "/scene create [scene] [entity_id] [duration] [...]",
      "/scene create [scene] [row] [col] [duration] [...]",
      "/scene remove [scene]",
      "/scene play [scene]",
      "/scene play [player] [scene]",
      "/scene list",
      "List of extra parameters:",
      "chat:true/false, movement:true/false, cinematic:true/false, fov:true/false",
      "ex: /scene create LoadingScreen 1234 5 chat:true cinematic:false",
      "/scene kuroro play LoadingScreen",
    ]
  }

  allowOwnerOnly() {
    return true
  }

  perform(player, args) {
    let subcommand = args[0]
    let sceneName = args[1];

    if (subcommand === "create") {
      let entityId = this.game.getEntityByNameOrId(args[2]);
      let row = args[2];
      let col = args[3];
      let fourthArgument = args[4];

      if (!entityId && !parseInt(fourthArgument)) {
        player.showChatError("no such entity");
        return;
      }

      let dataToSend = {};
      let MoreArgs;

      if (parseInt(fourthArgument)) {
        dataToSend.duration = parseInt(args[4]) || 3;
        dataToSend.row = row;
        dataToSend.col = col;
        dataToSend.entityId = null;
        MoreArgs = args.slice(5);
      } else {
        dataToSend.entityId = entityId;
        dataToSend.duration = parseInt(args[3]) || 3;
        dataToSend.row = null;
        dataToSend.col = null;
        MoreArgs = args.slice(4);
      }

      for (let NewArg of MoreArgs) {
        if (!NewArg.includes(":")) continue;

        let [key, val] = NewArg.split(":");
        let boolVal = val === "true";

        if (key === "chat") dataToSend.chat = boolVal;
        if (key === "fov") dataToSend.fov = boolVal;
        if (key === "cinematic") dataToSend.cinematic = boolVal;
        if (key === "movement") dataToSend.movement = boolVal;
      }

      this.game.createScene(sceneName, dataToSend);
      player.showChatSuccess("Scene created");

    } else if (subcommand === "rename") {
      let currentScene = this.game.hasScene(sceneName);
      if (!currentScene) {
        player.showChatError("no such scene");
        return;
      }
      let newName = args[2];
      currentScene.rename(newName);
      player.showChatSuccess(sceneName + " renamed to " + newName);

    } else if (subcommand === "list") {
      for (let scene in this.game.scenes) {
        player.showChatSuccess("- " + scene + " - " + this.game.scenes[scene].duration + "(s)");
      }

    } else if (subcommand === "remove") {
      if (this.game.hasScene(sceneName)) {
        delete this.game.scenes[sceneName];
        player.showChatSuccess("Scene removed");
      } else {
        player.showChatError("no such scene");
      }

    } else if (subcommand === "play" || (this.getPlayersBySelector(args[0]).length > 0 && args[1] === "play")) {
      let targetPlayers = this.getPlayersBySelector(args[0]);
      let sliceIndex = 2;

      if (targetPlayers.length > 0) {
        sceneName = args[2];
        sliceIndex = 3;
      }

      if (!this.game.hasScene(sceneName)) {
        player.showChatError("no such scene");
        return;
      }

      let keyValueArgs = args.slice(sliceIndex);
      let keyValueMap = this.convertKeyValueArgsToObj(keyValueArgs) || {};
      keyValueMap.playersToAffect = targetPlayers.length > 0 ? targetPlayers : [player]; // Default to current player if no selector

      this.game.playScene(sceneName, keyValueMap);
    }


  }
}

module.exports = Scene

