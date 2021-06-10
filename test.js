const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto('https://example.com')
  const now = new Date()
  await page.screenshot({ path: now.getTime() + '-example.png' })

  await browser.close()
})()
