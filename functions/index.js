const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const fetch = require('node-fetch')
const jsdom = require('jsdom')
const REGION = 'asia-northeast1'
const { JSDOM } = jsdom

const getAmazonInfoInUSA = async (data, ItemsId, eachItemId) => {
  const res = await fetch(data.linkInUS)
  const html = await res.text()
  const dom = new JSDOM(html)
  const document = dom.window.document

  const noImg = document.querySelectorAll('#g > div > a > img')
  if (noImg.length) {
    const ref = await admin
      .firestore()
      .collection(`Items/${ItemsId}/Items`)
      .doc(eachItemId)
      .update({ priceInUS: null })
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
      const ref = await admin
        .firestore()
        .collection(`Items/${ItemsId}/Items`)
        .doc(eachItemId)
        .update({ priceInUSToYen, priceDeff, priceInUS, USTitle })
    } else {
      const ref = await admin
        .firestore()
        .collection(`Items/${ItemsId}/Items`)
        .doc(eachItemId)
        .update({ priceInUS: null })
    }
  }
}

exports.updateItems = functions
  .region(REGION)
  .firestore.document('Items/{ItemsId}/Items/{eachItemId}')
  .onWrite(async (change, context) => {
    const ItemsId = context.params.ItemsId
    const eachItemId = context.params.eachItemId
    const data = change.after.data()

    getAmazonInfoInUSA(data, ItemsId, eachItemId)
  })
