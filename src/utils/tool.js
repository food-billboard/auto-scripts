const path = require('path')
const fs = require('fs-extra')

// 命令目录下的路径
function cwdPath(...args) {
  return path.join(process.cwd(), ...args)
}

// 读取目录 只获取文件夹
async function readdir(dirPath) {
  return fs.readdir(dirPath).then(dirList => {
    return dirList.filter(item => {
      return fs.statSync(path.join(dirPath, item)).isDirectory()
    })
  })
}

// 读取目录 只获取文件
async function readdirFile(dirPath) {
  return fs.readdir(dirPath).then(dirList => {
    return dirList.filter(item => {
      return !fs.statSync(path.join(dirPath, item)).isDirectory()
    })
  })
}

async function sleep(time=1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 获取本地隐私数据指定字段
function getEvnData(keys) {
  const targetKey = Array.isArray(keys) ? keys : [keys]
  const json = fs.readJsonSync(cwdPath('.env.json'))
  if(keys === undefined) return json
  return targetKey.reduce((acc, cur) => {
    acc[cur] = json[cur]
    return acc 
  }, {})
}

module.exports = {
  cwdPath,
  readdir,
  readdirFile,
  sleep,
  getEvnData
}