import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function createDriver(capabilities) {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = await new Builder().withCapabilities(capabilities).build()
      resolve(driver)
    } catch (e) {
      console.log(e)
    }
  })
}

export function getTextByCss(driver, css, timeout = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), timeout)
      const result = await driver.findElement(By.css(css)).getText()
      resolve(result)
    } catch (e) {
      console.log(e)
      resolve('')
    }
  })
}
export function getTextByXpath(driver, xpath, timeout = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.xpath(xpath)), timeout)
      const result = await driver.findElement(By.xpath(xpath)).getText()
      resolve(result)
    } catch (e) {
      console.log(e)
      resolve()
    }
  })
}

export function clickByCss(driver, css, timeout = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), timeout)
      const actions = driver.actions()
      const element = await driver.findElement(By.css(css))

      await actions
        .move({ origin: element })
        .click()
        .perform()

      resolve()
    } catch (e) {
      console.log(e)
      resolve(e)
    }
  })
}

export function simpleClickByCss(driver, css, timeout = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), timeout)

      const element = await driver.findElement(By.css(css)).click()

      resolve()
    } catch (e) {
      console.log(e)
      resolve(e)
    }
  })
}

export function gotoUrl(driver, url) {
  return new Promise(async (resolve, reject) => {
    try {
      let currentUrl = await driver.getCurrentUrl()
      while (decodeURI(currentUrl) !== decodeURI(url)) {
        await driver.get(url)
        currentUrl = await driver.getCurrentUrl()
      }
      resolve()
    } catch (e) {
      console.log(e)
    }
  })
}

export function waitEl(driver, css, seconds = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), seconds)
      resolve('ok')
    } catch (e) {
      console.log(e)
    }
  })
}

export function getAttrByCss(driver, css, attr) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await driver.findElement(By.css(css)).getAttribute(attr)
      resolve(result)
    } catch (e) {
      console.log(e)
    }
  })
}

export function countEls(driver, css) {
  return new Promise(async (resolve, reject) => {
    try {
      const el = await driver.findElements(By.css(css))
      resolve(el.length)
    } catch (e) {
      console.log(e)
    }
  })
}

export function typeTextByCss(driver, css, text, timeout = 100000) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until.elementLocated(By.css(css)), timeout)

      await driver.findElement(By.css(css)).sendKeys(text)
      resolve()
    } catch (e) {
      console.log(e)
      resolve()
    }
  })
}
