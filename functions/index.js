const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fetch = require('node-fetch')
const jsdom = require('jsdom')
const puppeteer = require('puppeteer')
const REGION = 'asia-northeast1'
const { JSDOM } = jsdom

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB',
}

const getAmazonInfoInUSA = async (data, ItemsId, eachItemId, page) => {
  try {
    console.log(3)

    // await page.waitForSelector('#nav-logo-sprites')
    await page.evaluate(async () => {
      const dataList = {}

      const noImg = document.querySelectorAll('#g > div > a > img')
      if (noImg.length) {
        cdataList = { priceInUS: null }
      } else {
        const titleExist = document.querySelectorAll('#productTitle')
        console.log(titleExist)

        if (titleExist.length) {
          const USTitle = document.querySelectorAll('#productTitle')[0].innerText
          console.log(USTitle)
          let priceInUS = null
          const priceExist01 = document.querySelectorAll('#price')
          if (priceExist01.length) {
            priceInUS = document.querySelectorAll('#price')[0].innerText
          }
          const priceExist02 = document.querySelectorAll('#price_inside_buybox')

          if (priceExist02.length) {
            priceInUS = document.querySelectorAll('#price_inside_buybox')[0].innerText
          }

          priceInUS = Number(priceInUS?.replace(/,/g, '').replace('$', ''))
          let priceInUSToYen = 0
          let priceDeff = 0

          if (priceInUS) {
            priceInUSToYen = priceInUS * 110
            priceDeff = data.priceInJp - priceInUSToYen
          }
          cdataList = { priceInUSToYen, priceDeff, priceInUS, USTitle }
        } else {
          cdataList = { priceInUS: null }
        }
      }
      return cdataList
    })
  } catch (err) {
    console.log(err)
  }
  return ''
}

exports.updateItems = functions
  .runWith(runtimeOpts)
  .region(REGION)
  .firestore.document('Items/{ItemsId}/Items/{eachItemId}')
  .onWrite(async (change, context) => {
    const ItemsId = context.params.ItemsId
    const eachItemId = context.params.eachItemId
    const data = change.after.data()
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    console.log(2)
    const page = await browser.newPage()
    await page.goto(data.linkInUS)
    const updateInfo = await getAmazonInfoInUSA(data, ItemsId, eachItemId, page)
    await admin
      .firestore()
      .collection(`Items/${ItemsId}/Items`)
      .doc(eachItemId)
      .update(updateInfo)
    await browser.close()
  })
