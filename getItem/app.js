import { promisify } from 'util'
import webdriver from 'selenium-webdriver'

const { Builder, By, until } = webdriver

import { exit } from 'process'
// import { itemsData } from './src/db/modules/item'
// import { getDriver } from './src/helper/seleniumHelper'
import { getKeepaInfo } from './keepaInfo'
import { getAmazonUSInfo } from './getAmazonUSInfo'
import { getUSDoler } from './helper/getUSDoler'
import { keepaLogin } from './helper/keepaLogin'
import { sort } from 'fast-sort'
import { getUSInfo } from './getUSInfo'

import fs from 'fs'

import { fileRead, listFiles } from './helper/helperFunctions'

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
const is_linux = process.platform === 'linux'

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
} from './helper/seleniumHelper'
import { keywords, categories, cellName } from './type/defaultData'
import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'
import { resolve } from 'path'
const app = Firebase.initializeApp({
  apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
  authDomain: 'webscrapingforbussiness.firebaseapp.com',
  projectId: 'webscrapingforbussiness',
  storageBucket: 'webscrapingforbussiness.appspot.com',
  messagingSenderId: '843243345021',
  appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
})

const db = Firebase.firestore(app)

const current = new Date()
const currentDate = current.getFullYear() + '-' + (current.getMonth() + 1)

const logsData = {
  logDB: [],
  async stream() {
    await db
      .collection('Logs')
      .doc(currentDate)
      .set({ created_at: current })
    await db.collection(`Logs/${currentDate}/Logs`).onSnapshot(res => {
      this.logDB = res
    })
  },
  async getDocs() {
    const result = []

    this.logDB.forEach(el => {
      result.push(el.data())
    })
    return result
  },
  getLatestDoc() {
    let result = []
    this.logDB.forEach(el => {
      result.push(el.data())
    })
    if (!result.length) return []
    const maxSearchIndex = sort(result).desc(r => r.searchTextIndex)[0].searchTextIndex
    const maxNodeIndex = sort(result.filter(e => e.searchTextIndex === maxSearchIndex)).desc(
      r => r.nodeIndex
    )[0].nodeIndex
    const maxPageNum = sort(
      result.filter(e => e.searchTextIndex === maxSearchIndex && e.nodeIndex === maxNodeIndex)
    ).desc(r => r.pageNum)[0].pageNum

    return {
      nodeIndex: maxNodeIndex,
      pageNum: maxPageNum,

      searchTextIndex: maxSearchIndex,
    }
  },
}

//TODO ?????????????????????ID?????????????????????
function createNewAccessId() {
  const LENGTH = 20 // ?????????????????????????????????
  const SOURCE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789' // ??????????????????
  let NewId = ''
  for (let i = 0; i < LENGTH; i++) {
    NewId += SOURCE[Math.floor(Math.random() * SOURCE.length)]
  }
  return NewId
}

const itemsData = {
  itemDB: [],
  async stream({ node }) {
    try {
      console.log(node)
      await db
        .collection('Items')
        .doc(currentDate)
        .set({ created_at: current })
      await db
        .collection(`Items/${currentDate}/Items`)
        .where('categoryNode', '==', node)
        .onSnapshot(res => {
          this.itemDB = res
        })
    } catch (err) {
      console.log(err)
    }
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

async function getAmazonInfo() {
  // ???????????????ID?????????????????????????????????????????????
  const accessId = createNewAccessId()
  // ????????????????????????????????????????????????
  await logsData.stream()

  const jpItemRef = await db.collection(`ItemsJP/${currentDate}/Items`)
  const logsRef = await db.collection(`Logs/${currentDate}/Logs`)

  console.log('start')

  const capabilities = webdriver.Capabilities.chrome()
  capabilities.set('chromeOptions', {})

  const driver = await createDriver(capabilities)

  await keepaLogin(driver)

  // await clickByCss(driver, '#currentLanguage')
  // await clickByCss(driver, '#language_domains > div:nth-child(6) > span:nth-child(1)')

  let logsDataObj = logsData.getLatestDoc()

  for (
    let i = logsDataObj?.searchTextIndex ? logsDataObj.searchTextIndex : 0;
    i <= keywords.length - 1;
    i++
  ) {
    for (
      let j = logsDataObj?.categoryNode ? logsDataObj.categoryNode : 0;
      j <= categories.length - 1;
      j++
    ) {
      await gotoUrl(
        driver,
        'https://keepa.com/#!finder/{"f":{"title":{"filterType":"text","type":"contains","filter":"' +
          keywords[i] +
          '"},"SALES_deltaPercent90":{"filterType":"number","type":"greaterThanOrEqual","filter":1,"filterTo":null},"COUNT_NEW_current":{"filterType":"number","type":"greaterThanOrEqual","filter":1,"filterTo":null},"rootCategory":{"filterType":"singleChoice","filter":"' +
          categories[j] +
          '","type":"equals"}},"s":[{"colId":"SALES_current","sort":"asc"}],"t":"g"}'
      )
      let isComp = false

      await clickByCss(
        driver,
        '#grid-tools-finder > div:nth-child(1) > span.tool__row.mdc-menu-anchor'
      )
      await clickByCss(driver, '#tool-row-menu > ul > li:nth-child(7)') // 7
      let pageNnumber = 1
      while (!isComp) {
        await waitEl(driver, '.cssload-box-loading', 100000)
        await waitEl(
          driver,
          '#grid-asin-finder > div > div.ag-root-wrapper-body.ag-layout-normal > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div:nth-child(1) > div:nth-child(3) > a > span',
          10000000
        )

        await clickByCss(driver, '#grid-tools-finder > div:nth-child(1) > span.tool__export > span')
        await clickByCss(driver, '#exportSubmit')

        const df = is_mac ? '/Users/tadakimatsushita/Downloads' : 'C:??Users??Administrator??Downloads'
        const res = await listFiles(df)

        await fileRead(res.path, cellName, jpItemRef, accessId)
        await getUSInfo()
        // console.log(fsRes)

        const logInfo = {
          created_at: new Date(),
          pageNum: pageNnumber,
          categoryNode: j,
          searchText: keywords[i],
          searchTextIndex: i,
          accessId,
        }
        await logsRef.doc().set(logInfo)
        const total = await getTextByCss(
          driver,
          '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(4)'
        )
        const current = await getTextByCss(
          driver,
          '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(3)'
        )
        if (total !== current) {
          pageNnumber += 1
          clickByCss(
            driver,
            '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > div:nth-child(5) > button'
          )
        } else {
          continue
        }
      }
    }
  }
  console.log('fin')
  driver.quit()

  return
}

;(async () => {
  return new Promise(async (resolve, reject) => {
    // while (true) {
    try {
      await getAmazonInfo()
      resolve()
    } catch (e) {
      reject(e)
    }
  })
  // }
})()
