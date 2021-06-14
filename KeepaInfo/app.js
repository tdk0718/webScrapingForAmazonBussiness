const fs = require('fs')
import { promisify } from 'util'
import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver
import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'
import { exit } from 'process'
// import { itemsData } from './src/db/modules/item'
// import { getDriver } from './src/helper/seleniumHelper'

const app = Firebase.initializeApp({
  apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
  authDomain: 'webscrapingforbussiness.firebaseapp.com',
  projectId: 'webscrapingforbussiness',
  storageBucket: 'webscrapingforbussiness.appspot.com',
  messagingSenderId: '843243345021',
  appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
})

import { sort } from 'fast-sort'

const db = Firebase.firestore(app)

const current = new Date()
const currentDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate()

const itemsData = {
  itemDB: [],
  async stream() {
    await db
      .collection('Items')
      .doc(currentDate)
      .set({ created_at: current })
    await db
      .collection(`Items/${currentDate}/Items`)
      .where('ranking', '==', 0)
      .onSnapshot(res => {
        this.itemDB = res
      })
  },
  getDocs() {
    const result = []
    this.itemDB.forEach(el => {
      result.push(el.data())
    })

    return result
  },
  getDocById(id) {
    const docs = this.getDocs()
    return docs.find(el => el.asin === id)
  },
  isHaveId(id) {
    const docs = this.getDocs()
    if (docs.find(el => el.asin === id)) return true
    return false
  },
}

;(async () => {
  try {
    await itemsData.stream()
    const dbItem = await db.collection(`Items/${currentDate}/Items`)
    const capabilities = webdriver.Capabilities.chrome()
    capabilities.set('chromeOptions', {
      args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,1200`],
    })
    const driver = await new Builder().withCapabilities(capabilities).build()
    await driver.get('https://keepa.com/#')
    await driver.wait(until.elementLocated(By.id('panelUserRegisterLogin')), 10000)
    await driver.findElement(By.id('panelUserRegisterLogin')).click()
    await driver.findElement(By.id('username')).sendKeys('t.matsushita0718@gmail.com')
    await driver.findElement(By.id('password')).sendKeys('tadaki4281')
    await driver.findElement(By.id('submitLogin')).click()

    let ref = await itemsData.getDocs()

    while (ref.length) {
      try {
        ref = await itemsData.getDocs()
        const infoObject = ref[0]

        await driver.get('https://keepa.com/#!product/5-' + infoObject.id)

        await driver.wait(until.elementLocated(By.id('tabMore')), 100000)
        await driver.findElement(By.css('li#tabMore')).click()
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
            }
            if (text === 'Reviews - レビュー数') {
              result.ReviewsNumber = await driver
                .findElement(By.css('.ag-row:nth-child(' + h + ') > div:nth-child(2)'))
                .getText()
            }
          }
        }
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
            }

            if (text === '新品アイテム数 - 現在価格') {
              result.NewItemNum = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
            }

            if (text === '新品アイテム数 - 90 days avg.') {
              result.NewItemNum90 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
            }
            if (text === '売れ筋ランキング - Drops last 30 days') {
              result.RankingDrop30 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
            }
            if (text === '売れ筋ランキング - Drops last 90 days') {
              result.RankingDrop90 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
            }
            if (text === '売れ筋ランキング - Drops last 180 days') {
              result.RankingDrop180 = await driver
                .findElement(
                  By.css('#grid-product-price .ag-row:nth-child(' + h + ') > div:nth-child(2)')
                )
                .getText()
            }
          }
        }
        console.log(result)
        dbItem.doc(infoObject.id).update(result)
      } catch (e) {
        console.log(e)
        continue
      }
    }

    driver.quit()
  } catch (err) {
    console.log(err)
  }

  return
})()
