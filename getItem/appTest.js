import { getUSInfo } from './getUSInfo'
;(async () => {
  // while (true) {
  try {
    await getUSInfo()
  } catch (e) {
    console.log(e)
  }
  // }
})()
