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
import { getKeepaInfo } from './keepaInfo'
import { getAmazonUSInfo } from './getAmazonUSInfo'
import { getUSDoler } from './helper/getUSDoler'
import { keepaLogin } from './helper/keepaLogin'
import { getTextByCss, countEls, getAttrByCss, waitEl, createDriver } from './helper/seleniumHelper'
import { keywords, categories } from './type/defaultData'

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
const currentDate = current.getFullYear() + '-' + (current.getMonth() + 1)

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

async function getAmazonInfo() {
  const accessId = createNewAccessId()
  let isFirstLoad = true
  let isExistTodayLog = false
  let isFinishGetForThisNode = false

  console.log('start')

  const capabilities = webdriver.Capabilities.chrome()
  capabilities.set('chromeOptions', {
    args: ['--headless', '--no-sandbox', '--disable-gpu', `--window-size=1980,400`],
  })
  const driver = []
  driver[1] = await createDriver(capabilities)
  driver[2] = await createDriver(capabilities)

  const driverInKeepa = await createDriver(capabilities)
  const driverInKeepaInJP = await createDriver(capabilities)
  const driverForUS = await createDriver(capabilities)

  try {
    if (!logsData.getDocs().length) {
      await logsData.stream()
    }
    const logRef = await db.collection(`Logs/${currentDate}/Logs`)

    const dolen = await getUSDoler(driver[1])

    await keepaLogin(driverInKeepa)
    await keepaLogin(driverInKeepaInJP)

    const ref = await db.collection(`Items/${currentDate}/Items`)

    let logsDataObj = logsData.getLatestDoc()

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
        await itemsData.stream({ node: categories[t].code })

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
              isFinishGetForThisNode = false
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
          const n = ((pageNum + 1) % 2) + 1

          if (pageNum === 1) {
            driver[2].get(
              'https://www.amazon.co.jp/s?k=' +
                putKeyword +
                '&page=' +
                pageNum +
                '&node=' +
                node +
                '&ref=sr_st_price-desc-rank'
            )
          }
          if (pageNum !== 1 && isFirstLoad) {
            driver[(pageNum % 2) + 1].get(
              'https://www.amazon.co.jp/s?k=' +
                putKeyword +
                '&page=' +
                pageNum +
                '&node=' +
                node +
                '&ref=sr_st_price-desc-rank'
            )
          }
          driver[((pageNum + 1) % 2) + 1].get(
            'https://www.amazon.co.jp/s?k=' +
              putKeyword +
              '&page=' +
              (pageNum + 1) +
              '&node=' +
              node +
              '&ref=sr_st_price-desc-rank'
          )

          await waitEl(driver[n], '#search', 50000)

          const numPerPage = await countEls(driver[n], '.s-result-item.s-asin')

          const pageOverFlowExist = await countEls(
            driver[n],
            '.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)'
          )

          let pageOverFlow = ''
          if (pageOverFlowExist) {
            pageOverFlow = await getTextByCss(
              driver[n],
              '.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)'
            )
          }
          const pageOverFlowArray = pageOverFlow?.replace(' 以上', '')?.split(' ')

          console.log(pageOverFlowArray)
          if (pageOverFlowArray[3]) {
            const currentNum = Number(pageOverFlowArray[3].split('-')[0].replace(',', ''))

            const limitNum = Number(
              pageOverFlowArray[3]
                .split('-')[1]
                .replace('件', '')
                .replace(',', '')
            )

            if (currentNum > limitNum) {
              isFinishGetForThisNode = true
              break
            }
          }
          if (!pageOverFlow) {
            isFinishGetForThisNode = true
            break
          }

          for (let i = 1; i <= numPerPage; i++) {
            const currentLatestLog = logsData.getLatestDoc() || {}

            let result = {}

            const elSize = await countEls(
              driver[n],
              '.s-result-item.s-asin:nth-child(' + i + ') h2.a-color-base'
            )
            console.log(i)

            const today = new Date()

            if (elSize) {
              const asin = await getAttrByCss(
                driver[n],
                '.s-result-item.s-asin:nth-child(' + i + ')',
                'data-asin'
              )

              const priceExistSize = await countEls(
                driver[n],
                '.s-result-item.s-asin:nth-child(' + i + ') span.a-price-whole'
              )

              if (priceExistSize) {
                let priceInJp = await getTextByCss(
                  driver[n],
                  '.s-result-item.s-asin:nth-child(' + i + ') span.a-price-whole'
                )
                priceInJp = priceInJp.replace(/,/g, '').replace('￥', '')

                if (Number(priceInJp) >= 3500 && !itemsData.getDocById(asin)?.id) {
                  await driverInKeepa.get('https://keepa.com/#!product/1-' + asin)
                  try {
                    await waitEl(driverInKeepa, 'span.priceNewsss', 1000)
                  } catch (e) {}
                  try {
                    await waitEl(driverInKeepa, 'span.priceNew', 1000)
                  } catch (e) {}

                  const amazonPriceInUSNumber = await countEls(driverInKeepa, 'span.priceAmazon')

                  const newPriceInUSNumber = await countEls(driverInKeepa, 'span.priceNew')

                  if (amazonPriceInUSNumber || newPriceInUSNumber) {
                    const amazonPriceInUS = amazonPriceInUSNumber
                      ? await getTextByCss(driverInKeepa, 'span.priceAmazon')
                      : await getTextByCss(driverInKeepa, 'span.priceNew')
                    const newPriceInUS = newPriceInUSNumber
                      ? await getTextByCss(driverInKeepa, 'span.priceNew')
                      : amazonPriceInUS

                    const USTitle =
                      (await getTextByCss(
                        driverInKeepa,
                        '#productInfoBox > .productTableDescriptionTitle'
                      )) || ''

                    result.priceInJp = Number(priceInJp)

                    result.title = await getTextByCss(
                      driver[n],
                      '.s-result-item.s-asin:nth-child(' + i + ') h2.a-color-base > a'
                    )
                    result.link = 'https://amazon.co.jp/dp/' + asin
                    result.asin = asin
                    result.id = asin
                    result.linkInUS = 'https://amazon.com/dp/' + asin
                    result.keyword = putKeyword
                    result.categoryNode = node
                    result.amazonPriceInUS = Number(
                      amazonPriceInUS.replace('$ ', '').replace(/,/g, '')
                    )

                    result.newPriceInUS = Number(newPriceInUS.replace('$ ', '').replace(/,/g, ''))
                    // Call eachItemInfoAtUsa(n, driver02)

                    result.created_at = today
                    result.USTitle = USTitle
                    result.dolen = Number(dolen)
                    result.amazonPriceInUSToYen = result.dolen * result.amazonPriceInUS
                    result.newPriceInUSToYen = result.dolen * result.newPriceInUS
                    let usPriceToJP = 0

                    result.deffPrice =
                      result.amazonPriceInUSToYen < result.newPriceInUSToYen
                        ? result.priceInJp - result.amazonPriceInUSToYen
                        : result.priceInJp - result.newPriceInUSToYen

                    result.category = categories[t].keyword
                    result.accessId = accessId
                    result.ranking = 0

                    if (result.deffPrice > 3000 && USTitle) {
                      const keepaInJP = await getKeepaInfo(driverInKeepaInJP, result)
                      result = { ...result, ...keepaInJP }
                      if (result.RankingDrop30) {
                        if (result.NewItemNum) {
                          result.itemNumPerSaler30 =
                            Number(result.RankingDrop30) / Number(result.NewItemNum)
                        }
                        result.totalPriceFromUS = await getAmazonUSInfo(driverForUS, result)

                        result.realDeffPrice =
                          result.priceInJp - result.dolen * result.totalPriceFromUS
                        if (result.totalPriceFromUS && result.realDeffPrice > 0) {
                          console.log(result)
                          await ref.doc(result.asin).set(result)
                        }
                      }
                    }
                  }
                  await driverInKeepa.get('https://keepa.com/#')
                }
              }
              isFirstLoad = false
            }
          }

          const logInfo = {
            created_at: new Date(),
            pageNum,
            categoryNode: node,
            nodeIndex: t,
            searchText: putKeyword,
            searchTextIndex: j,
            accessId,
          }
          await logRef.doc().set(logInfo)

          pageNum += 1
        }
      }
    }

    console.log('fin')
    driver[1].quit()
    driver[2].quit()

    driverInKeepaInJP.quit()
    driverInKeepa.quit()
    driverForUS.quit()
  } catch (err) {
    console.log(err)
    driver[1].quit()
    driver[2].quit()

    driverInKeepaInJP.quit()
    driverInKeepa.quit()
    driverForUS.quit()
  }
  return
}

;(async () => {
  while (true) {
    try {
      await getAmazonInfo()
    } catch (e) {
      console.log(e)
    }
  }
})()
