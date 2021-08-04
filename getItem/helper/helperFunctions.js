import fs from 'fs'
import { keywords, categories } from '../type/defaultData'

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
const is_linux = process.platform === 'linux'
import { sort } from 'fast-sort'

const getCondition = obj => {
  if (obj?.Reviews < 4) return false
  if (!obj?.RankingDrop30) return false
  if (obj?.RankingDrop30 < 1) return false
  return true
}

export const wait = async ms => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve() // setTimeoutの第一引数の関数として簡略化できる
    }, ms)
  })
}

export const fileRead = (path, cellName, jpItemRef, accessId) => {
  return new Promise(async (resolve, reject) => {
    const fsRes = await fs.readFile(path, 'utf-8', async (err, data) => {
      if (err) reject(err)
      const lines = data.split('\n')

      const fieldTitle = lines[0].split('","').reduce((arr, element) => {
        const cellInfo = cellName.find(e => {
          return element.replace(/"/g, '') === e.text
        })

        if (cellInfo) {
          return [
            ...arr,
            {
              index: lines[0].split('","').findIndex(el => el === element),
              field: cellInfo.field,
            },
          ]
        }

        return arr
      }, [])

      lines.shift()

      for (let t = 0; t < lines.length; t++) {
        const eachLine = lines[t]
        const recordData = eachLine.split('","').reduce((obj, val, index) => {
          const getField = fieldTitle.find(title => title.index === index)
          if (getField) {
            const getFieldInfo = cellName.find(f => f.field === getField.field)

            let revisedVal = val.replace(/"/g, '')

            if (getFieldInfo?.omit) {
              revisedVal = getFieldInfo.omit.reduce((st, el) => {
                return st.replace(el, '')
              }, revisedVal)
            }

            if (getFieldInfo?.type === 'Number') {
              revisedVal = Number(revisedVal)
            }

            return { ...obj, ...{ [`${getField.field}`]: revisedVal } }
          }
          return obj
        }, {})
        console.log(recordData)
        if (getCondition(recordData)) {
          console.log(t)
          await jpItemRef
            .doc(recordData.asin)
            .set({ ...recordData, ...{ created_at: new Date(), accessId } })
        }
      }
      return resolve('ok')
      fs.unlinkSync(path)
    })
  })
}

/**
 * 指定したディレクトリ配下のファイルを再帰的にリストアップする
 * @param {string} dirPath 対象ディレクトリのフルパス
 * @return {Array<string>} ファイルのフルパス
 */
export const listFiles = dirPath => {
  return new Promise(async (resolve, reject) => {
    try {
      let reDirPath = is_windows ? dirPath.replace(/¥/g, '\\') : dirPath

      const files = []
      const paths = fs.readdirSync(reDirPath)
      console.log('paths=>', paths)

      for (let name of paths) {
        try {
          if (name.indexOf('Product_Finder') !== -1) {
            const path = is_windows ? `${reDirPath}¥${name}` : `${reDirPath}/${name}`

            const stat = fs.statSync(path.replace(/¥/g, '\\'))
            const { ctime } = stat
            switch (true) {
              case stat.isFile():
                const sortNum = new Date(ctime)
                files.push({ path: path.replace(/¥/g, '\\'), sortNum: sortNum.getTime() })
                console.log(files)
                break

              case stat.isDirectory():
                break

              default:
            }
          }
        } catch (err) {
          console.error('error:', err.message)
        }
      }

      const res = sort(files).desc(e => e.sortNum)
      console.log(res[0])

      return resolve(res[0])
    } catch (e) {
      return reject(new Error(e))
    }
  })
}

export const USfileRead = (path, cellName, ItemRef) => {
  // プロミスをリターン
  return new Promise(async (resolve, reject) => {
    // データを読み込み
    const fsRes = await fs.readFile(path, 'utf-8', async (err, data) => {
      if (err) reject(err)
      const lines = data.split('\n')

      const fieldTitle = lines[0].split('","').reduce((arr, element) => {
        const cellInfo = cellName.find(e => {
          return element.replace(/"/g, '') === e.text
        })

        if (cellInfo) {
          return [
            ...arr,
            {
              index: lines[0].split('","').findIndex(el => el === element),
              field: cellInfo.field,
            },
          ]
        }

        return arr
      }, [])

      lines.shift()

      for (let t = 0; t < lines.length; t++) {
        const eachLine = lines[t]
        const recordData = eachLine.split('","').reduce((obj, val, index) => {
          const getField = fieldTitle.find(title => title.index === index)
          if (getField) {
            const getFieldInfo = cellName.find(f => f.field === getField.field)

            let revisedVal = val.replace(/"/g, '')

            if (getFieldInfo?.omit) {
              revisedVal = getFieldInfo.omit.reduce((st, el) => {
                return st.replace(el, '')
              }, revisedVal)
            }

            if (getFieldInfo?.type === 'Number') {
              revisedVal = Number(revisedVal)
            }

            return { ...obj, ...{ [`${getField.field}`]: revisedVal } }
          }
          return obj
        }, {})

        console.log(t)
        try {
          await ItemRef.doc(recordData.asin).update({
            ...recordData,
            ...{ update_at: new Date() },
          })
        } catch (e) {}
      }
      return resolve('ok')
      fs.unlinkSync(path)
    })
  })
}

/**
 * 指定したディレクトリ配下のファイルを再帰的にリストアップする
 * @param {string} dirPath 対象ディレクトリのフルパス
 * @return {Array<string>} ファイルのフルパス
 */
export const USlistFiles = dirPath => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = [{ path: '.crdownload' }]
      while (res[0].path.indexOf('.crdownload') !== -1) {
        let reDirPath = is_windows ? dirPath.replace(/¥/g, '\\') : dirPath

        const files = []
        const paths = fs.readdirSync(reDirPath)

        for (let name of paths) {
          try {
            if (name.indexOf('Product_Viewer') !== -1) {
              const path = is_windows ? `${reDirPath}¥${name}` : `${reDirPath}/${name}`

              const stat = fs.statSync(path.replace(/¥/g, '\\'))
              const { ctime } = stat
              switch (true) {
                case stat.isFile():
                  const sortNum = new Date(ctime)
                  files.push({ path: path.replace(/¥/g, '\\'), sortNum: sortNum.getTime() })
                  break

                case stat.isDirectory():
                  break

                default:
              }
            }
          } catch (err) {
            console.error('error:', err.message)
          }
        }

        res = files.length ? sort(files).desc(e => e.sortNum) : [{ path: '.crdownload' }]
        console.log(res)
      }
      return resolve(res[0])
    } catch (e) {
      return reject(new Error(e))
    }
  })
}
