const BaseCommand = require("./base_command")
const Constants = require("../../common/constants")
const Protocol = require('../../common/util/protocol')

class Setting extends BaseCommand {
  getUsage() {
    return [
      "Configures the settings of the colony",
      "/setting [key] [value]",
     "Available [true|false] keys: " + Object.keys(this.sector.settings).join(", "),
     "Available keys: " + this.getAllowedExtraSettings().join(", "),
      "ex: /setting isChatEnabled false",
      "/setting lighting 23",
    ]
  }

  isArgumentRequired() {
    return true
  }
  
  allowOwnerOnly() {
    return true
  }

  getAllowedExtraSettings() {
    return ['buildSpeed [1-5]', 'miningSpeed [1-5]', 'lighting [0-100]']
  }

  perform(player, args) {
    let key = args[0]
    let value = args[1]

    if (key === 'buildSpeed') {
      value = parseInt(value)
      if (value > 0 && value <= 5) {
        this.sector.setBuildSpeed(value)
        player.showChatSuccess("buildSpeed set to " + value)
      } else {
        player.showChatError("Invalid value. Values from 0 - 5 accepted only.")
      }
      return
    }

    if (key === 'miningSpeed') {
      value = parseInt(value)
      if (value > 0 && value <= 5) {
        this.sector.setMiningSpeed(value)
        player.showChatSuccess("miningSpeed set to " + value)
      } else {
        player.showChatError("Invalid value. Values from 0 - 5 accepted only.")
      }
      return
    }

    if (key === 'lighting') {
      value = parseInt(value)
      if (value >= 0 && value <= 100) {
        this.game.isLightingCustom = value
        player.showChatSuccess("lighting set to " + value)
      } else {
        player.showChatError("Invalid value. Values from 0 - 100 accepted only.")
      }
      return
    }

    if (!this.sector.settings.hasOwnProperty(key)) {
      player.showChatError("Invalid key. Valid keys are: " + Object.keys(this.sector.settings).join(", "))
      return
    }

    if (["true", "false"].indexOf(value) === -1) {
      player.showChatError("Invalid value. true/false accepted only.")
      return
    }

    if (value === 'true') value = true
    if (value === 'false') value = false

    this.sector.editSetting(key, value)
    player.showChatSuccess(key + " set to " + value)
  }

}

module.exports = Setting
