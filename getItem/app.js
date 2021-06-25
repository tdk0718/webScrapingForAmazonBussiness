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
import { getKeepaInfo } from './keepaInfo'
import { getAmazonUSInfo } from './getAmazonUSInfo'
import { getUSDoler } from './helper/getUSDoler'
import { keepaLogin } from './helper/keepaLogin'
import { sort } from 'fast-sort'
import fs from 'fs'

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

const getCondition = obj => {
  if (obj?.Reviews < 4) return false
  if (!obj?.RankingDrop30) return false
  if (obj?.RankingDrop30 < 1) return false
  return true
}
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

/**
 * 指定したディレクトリ配下のファイルを再帰的にリストアップする
 * @param {string} dirPath 対象ディレクトリのフルパス
 * @return {Array<string>} ファイルのフルパス
 */
const listFiles = dirPath => {
  return new Promise(async (resolve, reject) => {
    try {
      let reDirPath = is_windows ? dirPath.replace(/¥/g, '\\') : dirPath

      const files = []
      const paths = fs.readdirSync(reDirPath)

      for (let name of paths) {
        try {
          if (name.indexOf('Product_Finder') !== -1) {
            const path = is_windows ? `${reDirPath}¥${name}` : `${reDirPath}/${name}`

            const stat = fs.statSync(path.replace(/¥/g, '\\'))
            const { ctime } = stat
            switch (true) {
              case stat.isFile():
                const sortNum = new Date(ctime)
                files.push({ path: path.replace(/¥/g, '\\'), sortNum: sortNum.getTime() })
                break

              case stat.isDirectory():
                break

              default:
            }
          }
        } catch (err) {
          console.error('error:', err.message)
        }
      }

      const res = sort(files).desc(e => e.sortNum)

      resolve(res[0])
    } catch (e) {
      reject(new Error(e))
    }
  })
}

//TODO 新しいランダムIDを生成する関数
function createNewAccessId() {
  const LENGTH = 20 // 生成したい文字列の長さ
  const SOURCE = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789' // 元になる文字
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
  // ランダムなIDを生成（アクセスの判別で使う）
  const accessId = createNewAccessId()
  // ログ情報のスロリームを開いている
  await logsData.stream()

  const jpItemRef = await db.collection(`ItemsJP/${currentDate}/Items`)
  const logsRef = await db.collection(`Logs/${currentDate}/Logs`)

  console.log('start')

  const capabilities = webdriver.Capabilities.chrome()
  capabilities.set('chromeOptions', {
    args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,400`],
    prefs: { 'download.default_directory': './file' },
  })

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
      if (logsDataObj?.pageNum === 2) continue
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

        const df = is_mac ? '/Users/tadakimatsushita/Downloads' : 'C:¥Users¥Administrator¥Downloads'
        const res = await listFiles(df)

        await fs.readFile(res.path, 'utf-8', async (err, data) => {
          if (err) throw err
          const lines = data.split('\n')

          const fieldTitle = lines[0].split('","').reduce((arr, element) => {
            const cellInfo = cellName.find(e => {
              return element.replace(/"/g, '') === e.text
            })

            if (cellInfo) {
              return [
                ...arr,
                {
                  index: lines[0].split('","').findIndex(el => el === element),
                  field: cellInfo.field,
                },
              ]
            }

            return arr
          }, [])

          lines.shift()

          for (let t = 0; t < lines.length; t++) {
            const eachLine = lines[t]
            const recordData = eachLine.split('","').reduce((obj, val, index) => {
              const getField = fieldTitle.find(title => title.index === index)
              if (getField) {
                const getFieldInfo = cellName.find(f => f.field === getField.field)

                let revisedVal = val.replace(/"/g, '')

                if (getFieldInfo?.omit) {
                  revisedVal = getFieldInfo.omit.reduce((st, el) => {
                    return st.replace(el, '')
                  }, revisedVal)
                }

                if (getFieldInfo?.type === 'Number') {
                  revisedVal = Number(revisedVal)
                }

                return { ...obj, ...{ [`${getField.field}`]: revisedVal } }
              }
              return obj
            }, {})

            if (getCondition(recordData)) {
              console.log(t)
              await jpItemRef
                .doc(recordData.asin)
                .set({ ...recordData, ...{ created_at: new Date(), accessId } })
            }
          }
        })

        fs.unlinkSync(res.path)

        const total = await getTextByCss(
          driver,
          '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(4)'
        )
        const current = await getTextByCss(
          driver,
          '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(3)'
        )
        const logInfo = {
          created_at: new Date(),
          pageNum: pageNnumber,
          categoryNode: j,
          searchText: keywords[i],
          searchTextIndex: i,
          accessId,
        }
        await logsRef.doc().set(logInfo)
        if (total !== current) {
          pageNnumber += 1
          clickByCss(
            driver,
            '#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > div:nth-child(5) > button'
          )
        }
      }
    }
  }
  console.log('fin')
  driver.quit()

  return
}

;(async () => {
  // while (true) {
  try {
    await getAmazonInfo()
  } catch (e) {
    console.log(e)
  }
  // }
})()
