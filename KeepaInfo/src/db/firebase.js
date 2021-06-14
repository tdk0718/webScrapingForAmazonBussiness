import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'
import 'firebase/functions'

/**
 * @returns {Promise<void>}
 */
export function initFirebase() {
  const firebase = Firebase

  firebase.initializeApp({
    apiKey: 'AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI',
    authDomain: 'webscrapingforbussiness.firebaseapp.com',
    projectId: 'webscrapingforbussiness',
    storageBucket: 'webscrapingforbussiness.appspot.com',
    messagingSenderId: '843243345021',
    appId: '1:843243345021:web:908bb33aaaeec9c59dcd14',
  })

  return new Promise((resolve, reject) => {
    firebase
      .firestore()
      .enablePersistence({ synchronizeTabs: true })
      .then(resolve)
      .catch(err => {
        if (err.code === 'failed-precondition') {
          reject(err)
          // Multiple tabs open, persistence can only be
          // enabled in one tab at a a time.
        } else if (err.code === 'unimplemented') {
          reject(err)
          // The current browser does not support all of
          // the features required to enable persistence
        }
      })
  })
}

export function getCloudFunction(cloudFunctionName) {
  return Firebase.app()
    .functions('asia-northeast1')
    .httpsCallable(cloudFunctionName)
}
