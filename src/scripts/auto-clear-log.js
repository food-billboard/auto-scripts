const nodeSchedule = require('node-schedule')
const chalk = require('chalk')
const fs = require('fs-extra')
const dayjs = require('dayjs')
const { cwdPath, readdir, readdirFile } = require('../utils/tool')

const IGNORE_DIR_MAP = ['pm2']

async function method() {
  const dirList = await readdir(cwdPath('log'))
  const today = dayjs()
  dirList
  .filter(item => IGNORE_DIR_MAP.every(dir => !item.startsWith(dir)))
  .forEach(async (item) => {
    const dirList = await readdirFile(cwdPath('log', item))
    dirList
    .forEach(file => {
      const [fileName] = file.split('.')
      if(today.diff(dayjs(fileName), 'day') >= 30) {
        const path = cwdPath('log', item, file)
        fs.remove(path)
        console.log(chalk.green(`删除文件: ${path}`))
      }
    })
  })
}

function schedule() {
  return nodeSchedule.scheduleJob('auto-clear-log', "0 0 11 * * 1", method)
}

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

module.exports = schedule
module.exports.method = method 