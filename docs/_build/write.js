'use strict'
const path = require('path')
const fsExtra = require('fs-extra')
const { $log } = require('ts-log-debug')
const render = require('./render')


module.exports.writeIndex = () => {

  const content = render.render(path.join('../api', 'index.ejs'))

  fsExtra.writeFile(path.join('../api', 'index.md'), content, {
    encoding: 'utf8',
    flag: 'w'
  })
}

module.exports.writeSymbol = (symbol) => {

  if (symbol.symbolName.trim() === '') {
    console.error('Symbol empty =>', symbol)
    return
  }

  $log.info('Write', path.join(symbol.module.docPath, symbol.symbolName.toLowerCase() + '.md'))

  fsExtra.writeFile(path.join('../api', symbol.module.docPath, symbol.symbolName.toLowerCase() + '.md'), symbol.output, {
    encoding: 'utf8',
    flag: 'w'
  })
}
