import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function getAmazonUSInfo(driver, infoObject) {
  return new Promise(async (resolve, reject) => {
    let result = ''
    await driver.get(infoObject.linkInUS)
    try {
      result = await driver.findElement(
        By.css(
          '#a-popover-content-5 > table > tbody > tr:nth-child(5) > td.a-span2.a-text-right > span'
        ).getText()
      )
      result = result.replace(' $', '').replace(/,/g, '')
    } catch (e) {
      console.log(e)
    }
    return resolve(result)
  })
}
