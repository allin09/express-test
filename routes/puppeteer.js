var express = require('express')
var router = express.Router()
const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
require('colors')
/* GET puppeter listing. */
router.get('/', async (req, res, next) => {
  const browser = await puppeteer.launch({
    // headless: false, // 打开浏览器
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
  await page.pdf({ path: 'ryf.pdf', format: 'A4' }) // letter

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
  res.send('links: ' + links)
})

function requestLog(intercept) {
  console.log('req:' + intercept.url().green)
}
module.exports = router
