import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver
import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'

import { getKeepaInfo } from './keepaInfo'
import { getAmazonUSInfo } from './getAmazonUSInfo'
import { keepaLogin } from './helper/keepaLogin'

import { keywords, categories, cellNameUS } from './type/defaultData'

import { USfileRead, listFiles, USlistFiles, wait } from './helper/helperFunctions'

import {
  getTextByCss,
  countEls,
  getAttrByCss,
  waitEl,
  createDriver,
  clickByCss,
  gotoUrl,
  typeTextByCss,
  getTextByXpath,
  simpleClickByCss,
} from './helper/seleniumHelper'

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
const is_linux = process.platform === 'linux'

const app = Firebase.initializeApp({
  apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
  authDomain: 'webscrapingforbussiness.firebaseapp.com',
  projectId: 'webscrapingforbussiness',
  storageBucket: 'webscrapingforbussiness.appspot.com',
  messagingSenderId: '843243345021',
  appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
})

const current = new Date()
const currentDate = current.getFullYear() + '-' + (current.getMonth() + 1)

const itemsData = {
  itemDB: {},
  async stream() {
    try {
      console.log()
      await db
        .collection('Items')
        .doc(currentDate)
        .set({ created_at: current })

      const res = await db.collection(`ItemsJP/${currentDate}/Items`).get()
      res.forEach(el => {
        const data = el.data()
        this.itemDB = { ...this.itemDB, [`${data.asin}`]: data }
      })
      await db.collection(`Items/${currentDate}/Items`).onSnapshot(res => {
        res.forEach(el => {
          const data = el.data()
          this.itemDB = { ...this.itemDB, [`${data.asin}`]: data }
        })
      })
    } catch (err) {
      console.log(err)
    }
  },
  getDocs(num = 100000) {
    const result = Object.values(this.itemDB).filter(e => !e.USTitle)
    return result.slice(0, num)
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
  set(data) {
    return new Promise(async (resolve, reject) => {
      const id = data.id ? data.id : ''
      await db
        .collection(`ItemsJP/${currentDate}/Items`)
        .doc(id)
        .set(data)
    })
  },
}

const db = Firebase.firestore(app)

export async function getUSInfo(driver, datas) {
  return new Promise(async (resolve, reject) => {
    try {
      const capabilities = webdriver.Capabilities.chrome()
      capabilities.set('chromeOptions', {})

      const ItemRef = await db.collection(`ItemsJP/${currentDate}/Items`)

      const driver = await createDriver(capabilities)

      keepaLogin(driver)
      await itemsData.stream()

      while (itemsData.getDocs(999).length) {
        await driver.get('https://keepa.com/#')
        await gotoUrl(driver, 'https://keepa.com/#!viewer')
        const dfJp = is_mac
          ? '/Users/tadakimatsushita/Downloads'
          : 'C:¥Users¥Administrator¥Downloads'
        const resJp = await listFiles(dfJp)
        await typeTextByCss(driver, '#importInputFileTrigger', resJp.path)

        await clickByCss(driver, '#importSubmit')
        await wait(1000)
        await simpleClickByCss(driver, '.relativeAlignCenter #shareChartOverlay-close4')
        await wait(1000)
        await simpleClickByCss(
          driver,
          '#grid-tools-viewer > div:nth-child(1) > span.tool__export > span',
          9000
        )
        await wait(1000)
        await simpleClickByCss(driver, '#exportSubmit')

        const df = is_mac ? '/Users/tadakimatsushita/Downloads' : 'C:¥Users¥Administrator¥Downloads'
        const res = await USlistFiles(df)

        await USfileRead(res.path, cellNameUS, ItemRef)
      }
    } catch (e) {
      reject(e)
    }
  })
}
