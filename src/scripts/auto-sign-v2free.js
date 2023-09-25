const nodeSchedule = require('node-schedule')
const puppeteer = require('puppeteer')
const notifier = require('node-notifier')
const log = require('../utils/log')
const { sleep, getEvnData } = require('../utils/tool')
const { DEFAULT_NOTIFIER_CONFIG } = require('../utils/constants')

const SCHEDULE_KEY = 'auto-sign-v2free'

const COMMON_PUPPETEER_ARGS = { 
  headless: 'new', 
  // headless: false, 
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
}

const LOGIN_PAGE = 'https://w1.v2ai.top/auth/login'
const SIGN_PAGE = 'https://w1.v2ai.top/user'

function message(message) {
  notifier.notify({
    ...DEFAULT_NOTIFIER_CONFIG,
    title: '定时任务[v2free签到]',
    message,
  })
}

async function login() {
  console.log('进入登录页面')
  const browser = await puppeteer.launch(COMMON_PUPPETEER_ARGS);
  const page = await browser.newPage()

  try {
    await page.goto(LOGIN_PAGE);
    const { v2freeEmail, v2freePassword } = getEvnData(['v2freeEmail', 'v2freePassword'])
    // 邮箱
    await page.type('input[id=email]', v2freeEmail, {delay: 20})
    // 密码
    await page.type('input[id=passwd]', v2freePassword, {delay: 20})
    // 点击按钮
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[id=login]')
    ])

    await sign(page)
    
  }catch(err) {
    log(SCHEDULE_KEY, `代码执行错误：${err && err.toString()}`, false)
    message('登录出错')
  }finally {
    await browser.close()
  }
}

async function sign(selfPage) {
  let page = selfPage
  let browser 
  const isOpened = !!selfPage
  if(!isOpened) {
    browser = await puppeteer.launch(COMMON_PUPPETEER_ARGS);
    page = await browser.newPage()
  }
  try {
    if(!isOpened) await page.goto(SIGN_PAGE);
    let signBtn 

    try {
      signBtn = await page.$eval(
        '.ui-card-wrap .usercheck .btn',
        (value) => {
          return value
        }
      )
    }catch(err) {}

    // 已登录
    if(signBtn) {
      console.log('已登录')
      await page.click('.modal-dialog .text-right button')
      await sleep(2000)
      await page.click('.ui-card-wrap .usercheck .btn')
      await sleep(2000)
      let signedBtn 
      try {
        signedBtn = await page.$eval(
          '.ui-card-wrap .usercheck .btn.disabled',
          (value) => {
            return value
          }
        )
      }catch(err) {

      }
      if(signedBtn) {
        log(SCHEDULE_KEY, '签到成功', true)
        message('签到成功')
      }else {
        log(SCHEDULE_KEY, '点击签到后状态未发生变化', false)
        message('点击签到后状态未发生变化')
      }
    }
    // 未登录
    else {
      console.log('未登录')
      if(!isOpened) await browser.close()
      return login()
    }
    
  }catch(err) {
    message('签到代码执行错误')
    log(SCHEDULE_KEY, `代码执行错误：${err && err.toString()}`, false)
  }finally {
    if(!isOpened) await browser.close()
  }
}

async function method() {
  return sign()
}

function schedule() {
  return nodeSchedule.scheduleJob(SCHEDULE_KEY, "0 0 11 * * *", method)
}

module.exports = schedule
module.exports.method = method