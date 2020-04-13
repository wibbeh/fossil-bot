const kick = require("../commands/kick")
const PREFIX = "!"
module.exports = (client, message) => {
  if (message.content.startsWith("!kick")) {
    return kick(message) 
  }
}
