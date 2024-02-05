const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // No need for splitting 不拆分
    optimization: {
      splitChunks: false
    }
  }
})