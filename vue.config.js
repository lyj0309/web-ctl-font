module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8888,
        open: true,
        proxy: {
            '/api': {
                target: 'http://10.10.10.6:8083/', //接口域名
                changeOrigin: true,             //是否跨域
                ws: true,                       //是否代理 websockets
                secure: false,                   //是否https接口
                logLevel: "debug",
                pathRewrite: {                  //路径重置
                    '^/api': ''
                }
            }
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: []
      }
    }
}
