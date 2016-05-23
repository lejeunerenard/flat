import Remarkable from 'remarkable'
import assign from 'object-assign'
import recursive from 'recursive-readdir'
import path from 'path'
import defined from 'defined'
import Mustache from 'mustache'

import { writeFile, readFile } from './file-promise'

const md = new Remarkable()

export default class Flat {
  constructor (opt = {}) {
    let rootDir = defined(opt.rootDir, process.cwd())
    let contentDir = defined(opt.contentDir, 'content')
    contentDir = path.join(rootDir, contentDir)
    let publicDir = defined(opt.publicDir, 'public')
    publicDir = path.join(rootDir, publicDir)
    let layout = opt.layout

    if (!layout) {
      throw new Error('A layout is required')
    }

    assign(this, {
      rootDir,
      contentDir,
      publicDir,
      layout
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
      let name = path.parse(content).name
      let contentPath = path.join(this.publicDir, 'content', `${name}.html`)
      let flatPath = path.join(this.publicDir, `${name}.html`)

      return readFile(content, 'utf8')
        .then(md.render.bind(md))
        .then((html) => {
          return Promise.all([
            writeFile(contentPath, html),
            this.wrapLayout(html)
              .then((layoutHTML) => writeFile(flatPath, layoutHTML))
          ])
        })
    })

    return Promise.all(mdDones)
  }

  wrapLayout (html) {
    return readFile(this.layout, 'utf8')
      .then((template) => {
        return Mustache.render(template, { content: html })
      })
  }

  build () {
    return this.getContent()
      .then(this.processFiles.bind(this))
  }
}
