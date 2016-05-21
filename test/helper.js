import chai from 'chai'
chai.use(require('sinon-chai'))
let chaiFiles = require('chai-files')
chai.use(chaiFiles)
global.expect = chai.expect
global.sinon = require('sinon')
global.file = chaiFiles.file

process.env.NODE_ENV = 'test'
