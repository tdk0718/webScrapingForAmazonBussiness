// ---------------------------------------------
// 0. Make sure firebase is instantialized BEFORE magnetar
// ---------------------------------------------

import 'firebase/firestore'

firebase.initializeApp({
  // ...
})

// ---------------------------------------------
// 1. the plugin firestore for remote data store
// ---------------------------------------------
import { CreatePlugin as PluginFirestore } from '@magnetarjs/plugin-firestore'
import firebase from 'firebase/app'

// create the remote store plugin instance:
const remote = PluginFirestore({ firebaseInstance: firebase })

// ---------------------------------------
// 2. the plugin vue2 for local data store
// ---------------------------------------
import { CreatePlugin as PluginVue } from '@magnetarjs/plugin-vue2'
import vue from 'vue'

const generateRandomId = () =>
  firebase
    .firestore()
    .collection('random')
    .doc().id

// create the local store plugin instance:
const local = PluginVue({ vueInstance: vue, generateRandomId })

// -----------------------------------------------------
// 3. instantiate the Magnetar instance with the store plugins
// -----------------------------------------------------
import { Magnetar } from 'magnetar'
import { logger } from '@magnetarjs/utils'

export const magnetar = Magnetar({
  stores: { local, remote },
  localStoreName: 'local',
  executionOrder: {
    read: ['local', 'remote'],
    write: ['local', 'remote'],
    delete: ['local', 'remote'],
  },
  on: { success: logger }, // disable this on production builds
})
