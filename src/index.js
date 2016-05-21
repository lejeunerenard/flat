import Remarkable from 'remarkable'
import assign from 'object-assign'
import fs from 'fs'
import recursive from 'recursive-readdir'
import path from 'path'
import defined from 'defined'

const md = new Remarkable()

export default class Flat {
  constructor (opt = {}) {
    let rootDir = defined(opt.rootDir, process.cwd())
    let contentDir = defined(opt.contentDir, 'content')
    contentDir = path.join(rootDir, contentDir)
    let publicDir = defined(opt.publicDir, 'public')
    publicDir = path.join(rootDir, publicDir)

    assign(this, {
      rootDir,
      contentDir,
      publicDir
    })
  }

  getContent () {
    return new Promise((resolve, reject) => {
      recursive(this.contentDir, (err, files) => {
        if (err) {
          return reject(err)
        }

        resolve(files)
      })
    })
  }

  processFiles (contents) {
    let mdDones = contents.map((content) => {
      return new Promise((resolve, reject) => {
        let name = path.parse(content).name

        fs.readFile(content, 'utf8', (err, markdown) => {
          if (err) {
            return reject(err)
          }

          let html = md.render(markdown)
          let compiledPath = path.join(this.publicDir, 'content', `${name}.html`)

          fs.writeFile(compiledPath, html, (err) => {
            if (err) {
              return reject(err)
            }

            resolve(compiledPath)
          })
        })
      })
    })

    return Promise.all(mdDones)
  }

  build () {
    return this.getContent()
      .then(this.processFiles.bind(this))
  }
}
