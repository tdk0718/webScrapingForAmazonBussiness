import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver

export function getKeepaInfo(driver, infoObject) {
  return new Promise(async (resolve, reject) => {
    try {
      if (infoObject.id) {
        await driver.get('https://keepa.com/#!product/5-' + infoObject.id)
        try {
          await driver.wait(until.elementLocated(By.id('statisticss')), 2000)
        } catch (e) {
          console.log(e)
        }
        await driver.wait(until.elementLocated(By.id('tabMore')), 100000)
        await driver.findElement(By.id('tabMore')).click()

        await driver.wait(until.elementLocated(By.css('#grid-product-detail')), 100000)

        let tableRow = await driver.findElements(By.css('#grid-product-detail .ag-row'))
        const result = {}
        console.log(tableRow.length)
        for (let h = 1; h <= tableRow.length; h++) {
          const num = await driver.findElements(
            By.css('.ag-row:nth-child(' + h + ') > div:nth-child(1)')
          )

          if (num.length) {
            const text = await driver
              .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(1)'))
              .getText()
            console.log(text)
            if (text === 'Package - Dimension (cm³)') {
              result.Dimension = await driver
                .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(2)'))
                .getText()
            }

            if (text === 'Package - Weight (g)') {
              result.Weight = await driver
                .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(2)'))
                .getText()
            }

            if (text === 'Reviews - 評価') {
              result.Reviews = await driver
                .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(2)'))
                .getText()
              result.Reviews = Number(result.Reviews.replace(/,/g, '').replace(/ /g, ''))
            }
            if (text === 'Reviews - レビュー数') {
              result.ReviewsNumber = await driver
                .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(2)'))
                .getText()
              result.ReviewsNumber = Number(
                result.ReviewsNumber.replace(/,/g, '').replace(/ /g, '')
              )
            }
          }
        }
        result.ranking = 1
        tableRow = await driver.findElements(By.css('#grid-product-price .ag-row'))
        for (let h = 1; h <= tableRow.length; h++) {
          const num = await driver.findElements(
            By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(1)')
          )

          if (num.length) {
            const text = await driver
              .findElement(
                By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(1)')
              )
              .getText()
            console.log(text)
            if (text === '売れ筋ランキング - 現在価格') {
              result.ranking = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()

              result.ranking = Number(result.ranking.replace('# ', '').replace(/,/g, ''))
            }

            if (text === '新品アイテム数 - 現在価格') {
              result.NewItemNum = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
              result.NewItemNum = Number(result.NewItemNum.replace(/,/g, '').replace(/ /g, ''))
            }

            if (text === '新品アイテム数 - 90 days avg.') {
              result.NewItemNum90 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
              result.NewItemNum90 = Number(result.NewItemNum90.replace(/,/g, '').replace(/ /g, ''))
            }
            if (text === '売れ筋ランキング - Drops last 30 days') {
              result.RankingDrop30 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
              result.RankingDrop30 = Number(
                result.RankingDrop30.replace(/,/g, '').replace(/ /g, '')
              )
            }
            if (text === '売れ筋ランキング - Drops last 90 days') {
              result.RankingDrop90 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
              result.RankingDrop90 = Number(
                result.RankingDrop90.replace(/,/g, '').replace(/ /g, '')
              )
            }
            if (text === '売れ筋ランキング - Drops last 180 days') {
              result.RankingDrop180 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
              result.RankingDrop180 = Number(
                result.RankingDrop180.replace(/,/g, '').replace(/ /g, '')
              )
            }
          }
        }
        console.log(result)
        await driver.get('https://keepa.com/#')
        resolve(result)
      }
    } catch (e) {
      console.log(e)
    }

    resolve({})
  })
}
