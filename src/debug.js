const { program } = require('commander')
const chalk = require('chalk')

program
    .name("debug")
    .option("-m, --method <string>")
    .option("-p --path <string>")
    .option("-n --name <string>")
    .version(`1.0.0`)

const response = program.parse(process.argv).opts()
const { method, path="scripts", name="method" } = response

if(!method) {
  console.log(chalk.red('请输入对应要执行的方法'))
  process.exit(1)
}else {
  const targetModule = require(`./${path}/${method}`)
  let func 
  if(name === 'default') {
    func = targetModule
  }else {
    func = targetModule[name]
  }
  if(!func) {
    console.log(chalk.red(`未找到对应的方法【${method}】，请检查是否输入正确或是否正确导出指定方法`))
    process.exit(1)
  }else {
    Promise.resolve(func())
    .then(() => {
      console.log(chalk.green('执行成功'))
    })
    .catch(err => {
      console.error(err)
    })
    .then(() => {
      process.exit(0)
    })
  }
}