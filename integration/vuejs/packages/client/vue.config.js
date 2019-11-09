module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '^/rest': {
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
