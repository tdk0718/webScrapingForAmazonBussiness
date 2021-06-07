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
    const res = await db
      .collection(`Items/${currentDate}/Items`)
      .where('priceInUS', '==', '')
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

    // const capabilities = webdriver.Capabilities.chrome()
    // capabilities.set('chromeOptions', {
    //   args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,1200`],
    // })
    // const driver = []
    // for (let d = 1; d <= 2; d++) {
    //   driver[d] = await new Builder().withCapabilities(capabilities).build()
    //   await driver[d].get('https://www.amazon.com/')
    //   await driver[d].wait(until.elementLocated(By.id('nav-search-bar-form')), 50000)
    // }

    let itemDataArray = []

    // while (!isAllFin) {
    itemDataArray = itemsData.getDocs()
    console.log('itemDataArray=>', itemDataArray)
    // }
  } catch (err) {
    console.log('err=>', err)
  }

  return
})()
