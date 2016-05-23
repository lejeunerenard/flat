import fs from 'fs'

export function writeFile (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(path)
    })
  })
}
export function readFile (file, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => {
      if (err) {
        return reject(err)
      }

      resolve(data)
    })
  })
}
