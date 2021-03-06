import Flat from '../../src/'

import path from 'path'
import copy from 'recursive-copy'
import recursive from 'recursive-readdir'
import temp from 'temp'

let fixtureSrc = path.join(__dirname, '../', 'site')
temp.track()

let fixture
before(function (done) {
  temp.mkdir('site', function (err, dir) {
    if (err) {
      throw new Error(err)
    }

    fixture = dir

    copy(fixtureSrc, dir)
      .then(() => done())
      .catch(console.error)
  })
})

describe('build process', function () {
  let flat
  let expectedContentFiles
  let expectedFlatFiles

  beforeEach(function (done) {
    flat = new Flat({
      rootDir: fixture,
      layout: path.join(fixture, 'layout.html') })

    expectedContentFiles = []
    expectedFlatFiles = []
    recursive(flat.contentDir, (err, files) => {
      if (err) {
        throw new Error(err)
      }

      files.forEach((file) => {
        let name = path.parse(file).name

        let filename = path.join(flat.publicDir, 'content', `${name}.html`)
        expectedContentFiles.push(filename)

        let flatFile = path.join(flat.publicDir, `${name}.html`)
        expectedFlatFiles.push(flatFile)
      })

      done()
    })
  })

  it('creates a file for each content file', function () {
    return flat.build().then(() => {
      expectedContentFiles.forEach((output) => {
        expect(file(output)).to.exist
      })
    })
  })

  it('creates html files', function () {
    return flat.build().then(() => {
      expectedContentFiles.forEach((output) => {
        expect(file(output))
          .to.contain('<h1>Hello World</h1>')
      })
    })
  })

  it('wraps files in layout', function () {
    return flat.build().then(() => {
      expectedFlatFiles.forEach((output) => {
        expect(file(output)).to.contain('<body>')
      })
    })
  })
})
