import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'
const app = Firebase.initializeApp({
  apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
  authDomain: 'webscrapingforbussiness.firebaseapp.com',
  projectId: 'webscrapingforbussiness',
  storageBucket: 'webscrapingforbussiness.appspot.com',
  messagingSenderId: '843243345021',
  appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
})

const db = Firebase.firestore()

export const itemsData = {
  itemDB: [],
  async stream() {
    const ref = await db.collection('Items')
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
