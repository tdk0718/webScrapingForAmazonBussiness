import { getUSInfo } from './getUSInfo'
;(async () => {
  // while (true) {
  return new Promise(async (resolve, reject) => {
    try {
      await getUSInfo()
      resolve()
    } catch (e) {
      reject(e)
    }
  })
  // }
})()
