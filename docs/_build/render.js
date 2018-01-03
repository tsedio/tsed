const fs = require('fs')
const ejs = require('ejs')
const info = require('./info')
const trim = (str) => str.split('\n').map(s => s.trim()).join('')
/**
 *
 * @returns {Array}
 */
const symbolTypes = () => {
  const list = []
  Object.keys(info.symbolTypes)
    .filter(key => key.length === 1)
    .sort()
    .forEach((k) => {
      list.push(info.symbolTypes[k])
    })

  return list
}
/**
 *
 * @returns {Array}
 */
const symbolStatus = () => {
  const list = []
  Object
    .keys(info.status)
    .forEach((k) => {
      list.push(info.status[k])
    })

  return list
}
/**
 *
 * @returns {any[]}
 */
const modules = () => Object.keys(info.modules).map(key => info.modules[key])
/**
 *
 * @param module
 */
const symbolsOf = (module) => {
  let symbols = []

  info.symbols.forEach(symbol => {
    if (symbol.module.docPath === module) {
      symbols.push(symbol.symbolName)
    }
  })

  return symbols
    .sort()
    .map(symbolName => info.symbols.get(symbolName))
}
/**
 *
 * @param symbol
 * @returns {string}
 */
const mapSymbolInfo = (symbol) => {
  return [
    symbol.module.docPath,
    symbol.symbolName,
    symbol.symbolType,
    symbol.symbolCode,
    symbol.hasLabel('deprecated'),
    symbol.hasLabel('stable'),
    symbol.hasLabel('experimental'),
    symbol.hasLabel('private')
  ].join(';')
}

module.exports = {
  trim,
  /**
   *
   * @param filename
   * @param scope
   * @returns {*}
   */
  render(filename, scope = {}) {
    return ejs.render(fs.readFileSync(filename, { encoding: 'utf8' }), Object.assign(scope, { render: this }), {
      filename
    })
  },
  /**
   *
   * @param module
   * @param symbols
   * @returns {*}
   */
  renderApiList(module, symbols) {
    return trim(this.render('./templates/api-list.ejs', {
      module,
      symbols,
      mapSymbolInfo
    }))
  },
  /**
   *
   * @param label
   * @param items
   * @returns {*}
   */
  renderDropdown(label, items) {
    return trim(this.render('./templates/dropdown.ejs', {
      label,
      items
    }))
  },
  /**
   *
   * @returns {*}
   */
  renderApiNavbar() {
    return trim(this.render('./templates/api-navbar.ejs', {
      types: symbolTypes(),
      status: symbolStatus()
    }))
  },
  /**
   *
   * @returns {*}
   */
  renderApiSearch() {
    return trim(this.render('./templates/api-search.ejs', {
      route: 'api/index',
      types: symbolTypes(),
      status: symbolStatus(),
      modules: modules(),
      symbolsOf,
      mapSymbolInfo
    }))
  }
}

