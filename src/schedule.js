const autoClearLog = require('./scripts/auto-clear-log')
const autoSignV2free = require('./scripts/auto-sign-v2free')

function schedule() {
  autoClearLog()
  autoSignV2free()
}

module.exports = schedule