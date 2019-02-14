// 定时任务
const schedule = require('node-schedule')

const main = async () => {
  const puppeteer = require('puppeteer')
  const devices = require('puppeteer/DeviceDescriptors')
  const browser = await puppeteer.launch({
    headless: false, // 打开浏览器
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.emulate(devices['iPhone 8 Plus'])
  page.once('request', requestLog) // once
  // page.removeListener('request', requestLog)
  page.on('console', msg => console.log(msg.text))
  await page.goto('http://es6.ruanyifeng.com/')

  await page.waitForSelector('#sidebar ol li')
  // await page.screenshot({ path: 'screenshot.png' })
  await page.emulateMedia('screen')
  // pdf 要关闭浏览器
  // await page.pdf({ path: 'ryf.pdf', format: 'A4' }) // letter

  const links = await page.$$eval('#sidebar ol a', els =>
    els.map(el => el.innerHTML)
  )
  // const links = await page.$$eval('a', el => el.innerHTML)
  // const links = await page.evaluateHandle(() =>
  //   [...document.querySelectorAll('a')].map(el => el.innerHTML)
  // )
  // console.log('links: ', await links.jsonValue())
  console.log('links: ', links)

  await page.waitFor(1000 * 3)
  await browser.close()
}

function requestLog(intercept) {
  console.log('req:' + intercept.url().green)
}

const start = () => {
  const timer = schedule.scheduleJob('* * * * * *', main)
  setTimeout(() => {
    console.log('定时器取消')
    timer.cancel()
  }, 6000)
}
start()
