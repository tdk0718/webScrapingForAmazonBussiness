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
  async stream() {
    await db
      .collection('Items')
      .doc(currentDate)
      .set({ created_at: current })
    const ref = await db.collection(`Items/${currentDate}/items`)
    ref.onSnapshot(res => {
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

const categoriesData = {
  keywordDB: [],
  async stream() {
    const ref = await db.collection('Category')
    ref.onSnapshot(res => {
      this.categoryDB = res
    })
  },
  getDocs() {
    const result = []

    this.categoryDB.forEach(el => {
      result.push(el.data())
    })
    return result
  },
}

const logsData = {
  logDB: [],
  async stream() {
    await db
      .collection('Logs')
      .doc(currentDate)
      .set({ created_at: current })
    const ref = await db.collection(`Logs/${currentDate}/Logs`)
    ref.onSnapshot(res => {
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

const categories = [
  { code: 13384021, keyword: '雑誌' },
  { code: 561958, keyword: 'DVD' },
  { code: 403507011, keyword: 'ブルーレイ' },
  { code: 561956, keyword: 'ミュージック' },
  { code: 2123629051, keyword: '楽器・音響機器' },
  { code: 637394, keyword: 'ゲーム' },
  { code: 689132, keyword: 'PCゲーム' },
  { code: 3895771, keyword: 'キッチン家電' },
  { code: 3895791, keyword: '生活家電' },
  { code: 3895751, keyword: '理美容・健康家電' },
  { code: 3895761, keyword: '空調・季節家電' },
  { code: 2133982051, keyword: '照明' },
  { code: 124048011, keyword: '家電' },
  { code: 16462091, keyword: 'カメラ' },
  { code: 3465736051, keyword: '業務用カメラ・ビデオ' },
  { code: 171350011, keyword: '双眼鏡・望遠鏡・光学機器' },
  { code: 128187011, keyword: '携帯電話・スマートフォン' },
  { code: 3477381, keyword: 'テレビ・レコーダー' },
  { code: 16462081, keyword: 'オーディオ' },
  { code: 3477981, keyword: 'イヤホン・ヘッドホン' },
  { code: 3544106051, keyword: 'ウェアラブルデバイス' },
  { code: 3371421, keyword: 'アクセサリ・サプライ' },
  { code: 3210981, keyword: '家電＆カメラ' },
  { code: 2188762051, keyword: 'パソコン' },
  { code: 2127209051, keyword: 'パソコン・周辺機器' },
  { code: 2151826051, keyword: 'PCアクセサリ・サプライ' },
  { code: 2151901051, keyword: 'PCパーツ' },
  { code: 2188763051, keyword: 'プリンタ' },
  { code: 637392, keyword: 'PCソフト' },
  { code: 2201422051, keyword: 'PCソフト' },
  { code: 86731051, keyword: '文房具・オフィス用品' },
  { code: 13938481, keyword: 'キッチン用品・食器' },
  { code: 3093567051, keyword: 'インテリア・雑貨' },
  { code: 2538755051, keyword: 'ラグ・カーテン・ファブリック' },
  { code: 16428011, keyword: '家具' },
  { code: 13945081, keyword: '収納ストア' },
  { code: 2378086051, keyword: '寝具' },
  { code: 3093569051, keyword: '掃除・洗濯・バス・トイレ' },
  { code: 2038875051, keyword: '防犯・防災用品' },
  { code: 2127212051, keyword: 'ペット用品' },
  { code: 2189701051, keyword: '手芸・画材' },
  { code: 3828871, keyword: 'ホーム＆キッチン' },
  { code: 2031744051, keyword: '電動工具・エア工具' },
  { code: 2038157051, keyword: '作業工具' },
  { code: 2361405051, keyword: 'ガーデニング' },
  { code: 2039681051, keyword: 'エクステリア' },
  { code: 2016929051, keyword: 'DIY・工具' },
  { code: 13299531, keyword: 'おもちゃ' },
  { code: 466306, keyword: '絵本・児童書' },
  { code: 2277721051, keyword: 'ホビー' },
  { code: 2230006051, keyword: 'レディース' },
  { code: 2230005051, keyword: 'メンズ' },
  { code: 2230804051, keyword: 'キッズ' },
  { code: 2221077051, keyword: 'バッグ・スーツケース' },
  { code: 2188968051, keyword: 'スポーツウェア＆シューズ' },
  { code: 15337751, keyword: '自転車' },
  { code: 14315411, keyword: 'アウトドア' },
  { code: 14315521, keyword: '釣り' },
  { code: 14315501, keyword: 'フィットネス・トレーニング' },
  { code: 14315441, keyword: 'ゴルフ' },
  { code: 14304371, keyword: 'スポーツ＆アウトドア' },
  { code: 2017304051, keyword: '車＆バイク' },
  { code: 2319890051, keyword: 'バイク用品ストア' },
  { code: 3305008051, keyword: '自動車＆バイク車体' },
  { code: 3333565051, keyword: '工業機器' },
  { code: 3037451051, keyword: '研究開発用品' },
  { code: 3450744051, keyword: '衛生・清掃用品' },
  { code: 3445393051, keyword: '産業・研究開発用品' },
  { code: 3450874051, keyword: '衛生設備機器' },
  { code: 3450884051, keyword: '業務用ハンドドライヤー' },
  { code: 3450886051, keyword: '据付けトイレットペーパーホルダー' },
  { code: 3450889051, keyword: '据付けペーパータオルホルダー' },
  { code: 3450891051, keyword: 'トイレブース部品' },
]

const keywordData = {
  keywordDB: [],
  async stream() {
    const ref = await db.collection('Keyword')
    ref.onSnapshot(res => {
      this.keywordDB = res
    })
  },
  getDocs() {
    const result = []

    this.keywordDB.forEach(el => {
      result.push(el.data())
    })
    return result
  },
}

const keywords = ['並行輸入', '輸入', 'import', 'インポート', '海外', '北米', '国名', '日本未発売']

;(async () => {
  try {
    const accessId = createNewAccessId()
    let isFirstLoad = true
    let isExistTodayLog = false

    console.log('start')
    await itemsData.stream()
    // await categoriesData.stream()
    await logsData.stream()

    const logRef = await db.collection(`Logs/${currentDate}/Logs`)
    const capabilities = webdriver.Capabilities.chrome()
    capabilities.set('chromeOptions', {
      args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,1200`],
    })
    const driver = []
    driver[1] = await new Builder().withCapabilities(capabilities).build()
    driver[2] = await new Builder().withCapabilities(capabilities).build()
    driver[3] = await new Builder().withCapabilities(capabilities).build()

    const ref = await db.collection(`Items/${currentDate}/Items`)
    const items = await ref.get()

    let logsDataObj

    logsDataObj = logsData.getLatestDoc()

    const latestLogDate = logsDataObj?.created_at?.seconds
      ? new Date(logsDataObj.created_at.seconds * 1000)
      : new Date(0)
    const now = new Date()
    let checkLogData = {}
    if (
      latestLogDate.getFullYear() +
        '-' +
        latestLogDate.getFullYear() +
        '-' +
        latestLogDate.getDate() ===
      now.getFullYear() + '-' + now.getFullYear() + '-' + now.getDate()
    ) {
      isExistTodayLog = true
      checkLogData = latestLogDate
    }

    for (
      let j =
        isFirstLoad && isExistTodayLog
          ? keywords.findIndex(el => el === checkLogData.searchText)
          : 0;
      j < keywords.length;
      j++
    ) {
      for (
        let t =
          isFirstLoad && isExistTodayLog
            ? categories.findIndex(el => el.code === checkLogData.categoryNode)
            : 0;
        t < categories.length;
        t++
      ) {
        // pageNum,
        //             itemNumAtPage: i,
        //             categoryNode: node,
        //             searchText: putKeyword,
        let pageNum = isFirstLoad && isExistTodayLog ? checkLogData.pageNum : 1
        while (pageNum < 1000) {
          const currentLatestLog = logsData.getLatestDoc() || {}

          if (j > currentLatestLog.searchTextIndex) {
            j = currentLatestLog.searchTextIndex
            t = currentLatestLog.nodeIndex
            pageNum = currentLatestLog.pageNum
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1
            }
          }

          if (j === currentLatestLog.searchTextIndex && currentLatestLog.nodeIndex > t) {
            t = currentLatestLog.nodeIndex
            pageNum = currentLatestLog.pageNum
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1
            }
          }
          if (
            j === currentLatestLog.searchTextIndex &&
            currentLatestLog.nodeIndex > t &&
            currentLatestLog.pageNum > pageNum
          ) {
            pageNum = currentLatestLog.pageNum
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1
            }
          }

          const putKeyword = keywords[j]
          const node = categories[t].code
          const n = ((pageNum + 2) % 3) + 1
          console.log(n)
          if (pageNum === 1) {
            driver[1].get(
              'https://www.amazon.co.jp/s?k=' + putKeyword + '&page=' + pageNum + '&node=' + node
            )
            driver[2].get(
              'https://www.amazon.co.jp/s?k=' + putKeyword + '&page=' + pageNum + '&node=' + node
            )
          }
          if (pageNum !== 1 && isFirstLoad) {
            driver[((pageNum + 2) % 3) + 1].get(
              'https://www.amazon.co.jp/s?k=' + putKeyword + '&page=' + pageNum + '&node=' + node
            )
            driver[((pageNum + 3) % 3) + 1].get(
              'https://www.amazon.co.jp/s?k=' + putKeyword + '&page=' + pageNum + '&node=' + node
            )
          }
          driver[((pageNum + 1) % 3) + 1].get(
            'https://www.amazon.co.jp/s?k=' +
              putKeyword +
              '&page=' +
              (pageNum + 1) +
              '&node=' +
              node
          )

          await driver[n].wait(until.elementLocated(By.id('search')), 50000)

          const numPerPage = await driver[n].findElements(By.css('.s-result-item.s-asin'))

          const pageOverFlow = await driver[n]
            .findElement(
              By.css(
                '.sg-col-14-of-20.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)'
              )
            )
            .getText()

          const pageOverFlowArray = pageOverFlow.replace(' 以上', '').split(' ')

          // 検索結果 20,000 以上 のうち 49-72件 "並行輸入"
          console.log(pageOverFlowArray)
          if (pageOverFlowArray[3]) {
            const currentNum = Number(pageOverFlowArray[3].split('-')[0].replace(',', ''))

            console.log(pageOverFlowArray[3].split('-')[1])
            const limitNum = Number(
              pageOverFlowArray[3]
                .split('-')[1]
                .replace('件', '')
                .replace(',', '')
            )
            console.log(pageOverFlow)
            console.log(pageOverFlowArray[3])
            console.log(currentNum, limitNum)
            if (currentNum > limitNum) break
          }

          for (let i = 1; i <= numPerPage.length; i++) {
            const currentLatestLog = logsData.getLatestDoc() || {}

            let result = {}
            // let base64 = await driver[n].takeScreenshot()
            // let buffer = Buffer.from(base64, 'base64')

            // // bufferを保存
            // await promisify(fs.writeFile)('screenshot.jpg', buffer)

            const el = await driver[n].findElements(
              By.css('.s-result-item.s-asin:nth-child(' + i + ') h2.a-color-base')
            )

            console.log(i)
            const today = new Date()
            if (el.length) {
              const asin = await driver[n]
                .findElement(By.css('.s-result-item.s-asin:nth-child(' + i + ')'))
                .getAttribute('data-asin')

              const priceExist = await driver[n].findElements(
                By.css('.s-result-item.s-asin:nth-child(' + i + ') span.a-price-whole')
              )
              console.log('priceExist=>', priceExist)
              if (!itemsData.getDocById(asin)?.id && priceExist.length) {
                result.priceInJp = await driver[n]
                  .findElement(
                    By.css('.s-result-item.s-asin:nth-child(' + i + ') span.a-price-whole')
                  )
                  .getText()
                const title = driver[n].findElement(
                  By.css('.s-result-item.s-asin:nth-child(' + i + ') h2.a-color-base > a')
                )
                const text = await title.getText()
                result.title = text
                const href = await driver[n]
                  .findElement(
                    By.css('.s-result-item.s-asin:nth-child(' + i + ') h2.a-color-base > a')
                  )
                  .getAttribute('href')

                result.link = 'https://amazon.co.jp' + href

                if (
                  await driver[n].findElements(
                    By.css('.s-result-item.s-asin:nth-child(' + i + ') img.s-image')
                  )
                ) {
                  const src = await driver[n]
                    .findElement(By.css('.s-result-item.s-asin:nth-child(' + i + ') img.s-image'))
                    .getAttribute('src')
                  result.imageLink = src
                }

                result.asin = asin
                result.id = asin
                result.linkInUS = 'https://amazon.com/dp/' + asin
                result.keyword = putKeyword

                // Call eachItemInfoAtUsa(n, driver02)

                result.created_at = today
                result.category = categories[t].keyword
                result.accessId = accessId

                await ref.doc(result.asin).set(result)
                console.log(result)
                console.log(itemsData.getDocs().length)
              }
              isFirstLoad = false
              const logInfo = {
                created_at: today,
                pageNum,
                itemNumAtPage: i,
                categoryNode: node,
                nodeIndex: t,
                searchText: putKeyword,
                searchTextIndex: j,
                accessId,
              }
              await logRef.doc().set(logInfo)
            }
          }

          pageNum += 1
        }
      }
    }

    //   const title = await driver[n].findElement(By.id('productTitle')).getText()
    //   await ref.doc('title').set({ name: title })
    // } catch (err) {
    //   console.log(err)
    // }
    console.log('fin')
    driver[1].quit()
    driver[2].quit()
    driver[3].quit()
  } catch (err) {
    console.log(err)
    driver[1].quit()
    driver[2].quit()
    driver[3].quit()
  }

  return
})()
