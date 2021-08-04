import { getUSInfo } from './getUSInfo'
;(async () => {
  // while (true) {
  return new Promise(async (resolve, reject) => {
    try {
      await getUSInfo()
      return resolve()
    } catch (e) {
      return reject(e)
    }
  })
  // }
})()
