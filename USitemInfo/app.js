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

async function getEachInfoInUs(driver, info) {
  await driver.get(info.linkInUS)

  await driver.wait(until.elementLocated(By.id('nav-logo-sprites')), 50000)

  const noImg = await driver.findElements(By.css('#g > div > a > img'))
  if (noImg.length) {
    const ref = await db
      .collection(`Items/${currentDate}/Items`)
      .doc(info.id)
      .update({ priceInUS: null })
  } else {
    const titleExist = await driver.findElements(By.id('productTitle'))
    console.log(titleExist)

    if (titleExist.length) {
      const USTitle = await driver.findElement(By.id('productTitle')).getText()
      console.log(USTitle)
      let priceInUS = null
      const priceExist01 = await driver.findElements(By.id('price'))
      if (priceExist01.length) {
        priceInUS = await driver.findElement(By.id('price')).getText()
      }
      const priceExist02 = await driver.findElements(By.id('price_inside_buybox'))

      if (priceExist02.length) {
        priceInUS = await driver.findElement(By.id('price_inside_buybox')).getText()
      }

      priceInUS = Number(priceInUS?.replace('$', ''))
      let priceInUSToYen = 0
      let priceDeff = 0

      if (priceInUS) {
        priceInUSToYen = priceInUS * 110
        priceDeff = info.priceInJp - priceInUSToYen
      }
      const ref = await db
        .collection(`Items/${currentDate}/Items`)
        .doc(info.id)
        .update({ priceInUSToYen, priceDeff, priceInUS, USTitle })
    } else {
      const ref = await db
        .collection(`Items/${currentDate}/Items`)
        .doc(info.id)
        .update({ priceInUS: null })
    }
  }
  return
}

const itemsData = {
  itemDB: [],
  async stream() {
    return new Promise(async (resolve, reject) => {
      await db
        .collection('Items')
        .doc(currentDate)
        .set({ created_at: current })
      const getRes = await db
        .collection(`Items/${currentDate}/Items`)
        .where('priceInUS', '==', '')
        .get()
      const res = await db
        .collection(`Items/${currentDate}/Items`)
        .where('priceInUS', '==', '')
        .onSnapshot(res => {
          const result = []
          res.forEach(e => {
            result.push(e.data())
          })
          const result02 = []
          this.itemDB = result.length ? res : getRes
          this.itemDB.forEach(e => {
            result02.push(e.data())
          })
          if (result02) {
            return resolve()
          }
        })
    })
  },
  getDocs() {
    const result = []

    this.itemDB.forEach(el => {
      result.push(el.data())
    })
    return result
  },
  isHaveId(id) {
    const docs = this.getDocs()
    if (docs.find(el => el.id === id)) return true
    return false
  },
}

;(async () => {
  try {
    await itemsData.stream()
    let isAllFin = false

    let itemDataArray = []
    const capabilities = webdriver.Capabilities.chrome()
    capabilities.set('chromeOptions', {
      args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,1200`],
    })
    const driver = []
    for (let d = 0; d < 20; d++) {
      driver[d] = await new Builder().withCapabilities(capabilities).build()
    }

    let num = 0

    while (!isAllFin) {
      const driverNum = num % 20
      console.log(driverNum)
      itemDataArray = itemsData.getDocs()
      console.log('itemDataArray=>', itemDataArray[0].id)
      const ref = await db
        .collection(`Items/${currentDate}/Items`)
        .doc(itemDataArray[0].id)
        .update({ priceInUS: null })
      getEachInfoInUs(driver[driverNum], itemDataArray[0])
      num += 1
    }
  } catch (err) {
    console.log('err=>', err)
  }

  return
})()
