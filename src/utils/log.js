const dayjs = require('dayjs')
const fs = require('fs-extra')
const chalk = require('chalk')
const { cwdPath } = require('../utils/tool')

function today() {
  return dayjs().format('YYYY-MM-DD')
}

function log(project, message, success=true) {
  fs.ensureDirSync(cwdPath('log'))
  const fileName = `${today()}.txt`
  fs.ensureDirSync(cwdPath('log', project))
  const content = `[${success ? 'success' : 'error'}](${dayjs().format('YYYY-MM-DD hh:mm:ss')})${message}`
  console.log(chalk[success ? 'green' : 'red'](content))
  return fs.appendFile(cwdPath('log', project, fileName), `${content}\n`)
}

module.exports = log 