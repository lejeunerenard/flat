import Flat from '../../src/'

import path from 'path'
import copy from 'recursive-copy'
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
  let expectedFiles = []

  beforeEach(function () {
    flat = new Flat({ rootDir: fixture })

    let filename = path.join(fixture, 'public', 'content', 'hello-world.html')
    expectedFiles.push(filename)
  })

  it('creates a file for each content file', function () {
    return flat.build().then(() => {
      expectedFiles.forEach((output) => {
        expect(file(output)).to.exist
      })
    })
  })

  it('creates html files', function () {
    return flat.build().then(() => {
      expectedFiles.forEach((output) => {
        expect(file(output))
          .to.contain('<h1>Hello World</h1>')
      })
    })
  })
})
