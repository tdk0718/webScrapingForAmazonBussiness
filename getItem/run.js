const ExecSh = require('exec-sh')
const { promise: ExecShPromise } = ExecSh
;(async () => {
  let isComp = false

  while (!isComp) {
    // try {
    //   await ExecShPromise('npm run dev', { cwd: './' })
    // } catch (e) {
    //   process.exit()
    // }
    try {
      await ExecShPromise('npm run devtest', { cwd: './' })
    } catch (e) {
      process.exit()
    }
  }
})()
