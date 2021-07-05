const ExecSh = require('exec-sh')
const { promise: ExecShPromise } = ExecSh
console.log(1)
;(async () => {
  console.log(1)
  let isComp = false

  while (!isComp) {
    try {
      await ExecShPromise('npm run dev', { cwd: './' })
      console.log(1)
    } catch (e) {
      process.exit()
    }
  }
})()
