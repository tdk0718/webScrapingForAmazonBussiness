import webdriver from 'selenium-webdriver'
const { Builder, By, until } = webdriver
import Firebase from 'firebase/app'

import { getKeepaInfo } from './keepaInfo'
import { getAmazonUSInfo } from './getAmazonUSInfo'
import { keepaLogin } from './helper/keepaLogin'
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

const app = Firebase.initializeApp({
  apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
  authDomain: 'webscrapingforbussiness.firebaseapp.com',
  projectId: 'webscrapingforbussiness',
  storageBucket: 'webscrapingforbussiness.appspot.com',
  messagingSenderId: '843243345021',
  appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
})

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

const db = Firebase.firestore(app)

export async function getUSInfo(driver, datas) {
  return new Promise(async (resolve, reject) => {
    await itemsData.stream()
    await gotoUrl(driver, 'https://keepa.com/#!viewer')
    console.log(itemsData.getDocs())
  })
}
