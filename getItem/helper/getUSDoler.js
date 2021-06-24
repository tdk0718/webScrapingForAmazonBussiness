import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver
export function getUSDoler(driver) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.get(
        'https://www.google.co.jp/search?q=%E3%83%89%E3%83%AB%E3%80%80%E6%97%A5%E6%9C%AC%E3%80%80&newwindow=1&sxsrf=ALeKk02FiS2ljVzmM6I_ssSrneI7HG49fQ%3A1622019947152&ei=aw-uYN7pCOuGr7wPsKqeGA&oq=%E3%83%89%E3%83%AB%E3%80%80%E6%97%A5%E6%9C%AC%E3%80%80&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEMQCMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeMgYIABAHEB46CQgAELADEAQQJToJCAAQsAMQBxAeOgQIIxAnOggIABCxAxCDAToFCAAQsQNQ1hhY4SRgkShoAXAAeACAAcQBiAG5BZIBAzAuNJgBAKABAaABAqoBB2d3cy13aXrIAQjAAQE&sclient=gws-wiz&ved=0ahUKEwiey5KW_-bwAhVrw4sBHTCVBwMQ4dUDCA4&uact=5'
      )

      const dolen = await driver
        .findElement(
          By.css(
            '#knowledge-currency__updatable-data-column > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)'
          )
        )
        .getText()

      resolve(Number(dolen))
    } catch (e) {
      reject(e)
    }
  })
}
